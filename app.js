
const STORAGE_KEY = 'renovaMvpData';
const SESSION_KEY = 'renovaMvpCurrentUserId';

const state = {
  selectedView: 'login',
  selectedImovel: null,
  currentUserId: null,
  loginError: '',
  passwordMessage: '',
  passwordError: '',
};

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function clone(data){ return JSON.parse(JSON.stringify(data)); }
function normalizeData(data){
  const seedByEmail = new Map((window.SEED_DATA.usuarios || []).map(u => [String(u.email || '').toLowerCase(), u]));
  data.usuarios = (data.usuarios || []).map(u => {
    if (!u.senha) {
      const seed = seedByEmail.get(String(u.email || '').toLowerCase());
      u.senha = seed?.senha || 'Senha@123';
    }
    return u;
  });
  return data;
}
function loadData(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { return normalizeData(JSON.parse(saved)); } catch(e){}
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clone(window.SEED_DATA)));
  return normalizeData(clone(window.SEED_DATA));
}
let APP_DATA = loadData();
function saveData(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(APP_DATA)); }
function resetData(){ APP_DATA = normalizeData(clone(window.SEED_DATA)); saveData(); state.selectedView='dados'; render(); }
function nextId(prefix, arr){
  const max = arr.reduce((m, item) => Math.max(m, parseInt(String(item.id).replace(/\D/g,'')) || 0), 0);
  return prefix + String(max + 1);
}
function findUser(id) { return APP_DATA.usuarios.find(u => u.id === id); }
function findOwner(id) { return APP_DATA.proprietarios.find(p => p.id === id); }
function findBuyer(id) { return APP_DATA.compradores.find(c => c.id === id); }
function findImovel(id) { return APP_DATA.imoveis.find(i => i.id === id); }
function findTermo(id) { return APP_DATA.termosVisita.find(t => t.id === id); }
function computeTermoStatus(valor){ return valor && Number(valor) > 0 ? 'com_proposta' : 'registrado'; }
function termoDisponivelParaNegocio(t){ return t && t.status !== 'convertido_em_negocio' && (!APP_DATA.negocios.some(n => n.termoVisitaId === t.id)); }
function todayISO(){ return new Date().toISOString().slice(0,10); }
function getCurrentUser() { return state.currentUserId ? findUser(state.currentUserId) : null; }
function isDirector(){ const u=getCurrentUser(); return u && u.perfil==='diretor'; }
function ensureSession() {
  const saved = localStorage.getItem(SESSION_KEY);
  if (saved && findUser(saved)) { state.currentUserId = saved; state.selectedView = 'home'; }
}
function loginWithPassword(event) {
  event.preventDefault();
  const email = String(document.getElementById('login-email')?.value || '').trim().toLowerCase();
  const senha = String(document.getElementById('login-senha')?.value || '');
  const user = APP_DATA.usuarios.find(u => String(u.email || '').toLowerCase() === email && u.senha === senha && u.ativo !== false);
  if (!user) {
    state.loginError = 'Credenciais inválidas. Verifique e-mail e senha.';
    render();
    return;
  }
  state.loginError = '';
  state.currentUserId = user.id;
  localStorage.setItem(SESSION_KEY, user.id);
  state.selectedView = 'dashboard';
  render();
}
function logout() { state.currentUserId = null; state.selectedView = 'login'; state.loginError=''; state.passwordMessage=''; state.passwordError=''; localStorage.removeItem(SESSION_KEY); render(); }
function setView(view) { state.selectedView = view; state.passwordMessage=''; state.passwordError=''; render(); }
function showImovel(id) { state.selectedImovel = id; state.selectedView = 'detalhe'; render(); }

function renderNav() {
  const nav = document.getElementById('app-nav');
  const user = getCurrentUser();
  if (!user) {
    nav.innerHTML = `
      <button class="nav-btn ${state.selectedView === 'login' ? 'active' : ''}" onclick="setView('login')">Login</button>
      <button class="nav-btn ${state.selectedView === 'home' ? 'active' : ''}" onclick="setView('home')">Home pública</button>
    `;
    return;
  }
  nav.innerHTML = `
    <button class="nav-btn ${state.selectedView === 'home' ? 'active' : ''}" onclick="setView('home')">Home pública</button>
    <button class="nav-btn ${state.selectedView === 'dashboard' ? 'active' : ''}" onclick="setView('dashboard')">Painel</button>
    <button class="nav-btn ${state.selectedView === 'imoveis' ? 'active' : ''}" onclick="setView('imoveis')">Imóveis</button>
    <button class="nav-btn ${state.selectedView === 'proprietarios' ? 'active' : ''}" onclick="setView('proprietarios')">Proprietários</button>
    <button class="nav-btn ${state.selectedView === 'termos' ? 'active' : ''}" onclick="setView('termos')">Termos de Visita</button>
    <button class="nav-btn ${state.selectedView === 'negocios' ? 'active' : ''}" onclick="setView('negocios')">Negócios</button>
    <button class="nav-btn ${state.selectedView === 'compradores' ? 'active' : ''}" onclick="setView('compradores')">Compradores</button>
    <button class="nav-btn ${state.selectedView === 'usuarios' ? 'active' : ''}" onclick="setView('usuarios')">Usuários</button>
    <button class="nav-btn ${state.selectedView === 'dados' ? 'active' : ''}" onclick="setView('dados')">Dados</button>
    <button class="nav-btn ${state.selectedView === 'senha' ? 'active' : ''}" onclick="setView('senha')">Alterar senha</button>
    <span class="user-chip"><strong>${user.nome}</strong> · ${user.perfil}</span>
    <button class="logout-btn" onclick="logout()">Sair</button>
  `;
}

function renderLogin() {
  const diretores = APP_DATA.usuarios.filter(u => u.perfil === 'diretor' && u.ativo !== false);
  const corretores = APP_DATA.usuarios.filter(u => u.perfil === 'corretor' && u.ativo !== false);
  return `
    <section class="login-shell">
      <div class="login-grid">
        <div class="login-card">
          <span class="eyebrow">Autenticação</span>
          <h2>Acesso</h2>
          <p>Entre com e-mail e senha de um usuário interno para acessar os módulos operacionais da plataforma.</p>
          <form onsubmit="loginWithPassword(event)">
            <label class="login-label" for="login-email">E-mail</label>
            <input id="login-email" class="login-select" type="email" placeholder="ana@renova.com" required>
            <label class="login-label" for="login-senha">Senha</label>
            <input id="login-senha" class="login-select" type="password" placeholder="••••••••" required>
            ${state.loginError ? `<div class="login-error">${state.loginError}</div>` : ''}
            <div class="login-actions">
              <button class="primary" type="submit">Entrar</button>
            </div>
          </form>
          <div class="login-note"><strong>Credenciais:</strong> diretores usam senha inicial <code>Renova@123</code> e corretores usam senha inicial <code>Corretor@123</code>.</div>
        </div>
        <div class="login-card login-side-card">
          <span class="eyebrow">Usuários internos</span>
          <h2>Contas internas</h2>
          <div class="user-list-block">
            ${diretores.map(u => `<div class="user-line"><strong>Diretor</strong> : ${u.email}</div>`).join('')}
            ${corretores.map(u => `<div class="user-line"><strong>Corretor</strong> : ${u.email}</div>`).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderSenha() {
  const user = getCurrentUser();
  if (!user) {
    return `<section><div class="notice">Faça login para alterar a senha.</div></section>`;
  }
  return `
    <section class="login-shell">
      <div class="login-card">
        <span class="eyebrow">Alteração de senha</span>
        <h2>Alterar senha</h2>
        <p>Atualize a senha do usuário logado.</p>
        <form onsubmit="changePassword(event)">
          <label class="login-label">Usuário</label>
          <input class="login-select" value="${user.email}" readonly>
          <label class="login-label" for="senha-atual">Senha atual</label>
          <input id="senha-atual" class="login-select" type="password" required>
          <label class="login-label" for="senha-nova">Nova senha</label>
          <input id="senha-nova" class="login-select" type="password" required>
          <label class="login-label" for="senha-confirmacao">Confirmar nova senha</label>
          <input id="senha-confirmacao" class="login-select" type="password" required>
          ${state.passwordError ? `<div class="login-error">${state.passwordError}</div>` : ''}
          ${state.passwordMessage ? `<div class="login-success">${state.passwordMessage}</div>` : ''}
          <div class="login-actions">
            <button class="primary" type="submit">Salvar nova senha</button>
          </div>
        </form>
      </div>
    </section>
  `;
}

function renderHome() {
  const ativos = APP_DATA.imoveis.filter(i => i.status === 'ativo' && i.ativo !== false);
  return `
    <section class="hero">
      <div>
        <span class="eyebrow">Home</span>
        <h1>Renova Soluções Imobiliárias</h1>
      </div>
      
    </section>
    <section>
      <div class="section-head">
        <h2>Imóveis disponíveis</h2>
      </div>
      <div class="grid">
        ${ativos.map(i => `
          <article class="card">
            <img src="${i.imagem}" alt="${i.titulo}">
            <div class="card-body">
              <div class="meta">${i.codigo} · ${i.tipo}</div>
              <h3>${i.titulo}</h3>
              <p>${i.endereco}<br>${i.bairro}, ${i.cidade}</p>
              <div class="price">${currency.format(i.preco)}</div>
              <div class="features">${i.quartos || '-'} qts · ${i.banheiros || '-'} ban · ${i.vagas || '-'} vagas · ${i.area} m²</div>
              <button class="primary" onclick="showImovel('${i.id}')">Ver detalhes</button>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderDetalhe() {
  const i = findImovel(state.selectedImovel);
  const owner = findOwner(i.proprietarioId);
  const broker = findUser(i.corretorId);
  return `
    <section class="detail">
      <img class="detail-image" src="${i.imagem}" alt="${i.titulo}">
      <div class="detail-body">
        <button class="ghost" onclick="setView('home')">← Voltar</button>
        <div class="meta">${i.codigo} · ${i.tipo} · ${i.status}</div>
        <h2>${i.titulo}</h2>
        <div class="price">${currency.format(i.preco)}</div>
        <p>${i.endereco}<br>${i.bairro}, ${i.cidade}</p>
        <div class="features">${i.quartos || '-'} quartos · ${i.banheiros || '-'} banheiros · ${i.vagas || '-'} vagas · ${i.area} m²</div>
        <div class="panel">
          <h3>Dados operacionais</h3>
          <p><strong>Proprietário:</strong> ${owner?.nome || '—'}</p>
          <p><strong>Corretor responsável:</strong> ${broker?.nome || '—'}</p>
        </div>
      </div>
    </section>
  `;
}

function renderDashboard() {
  const ativos = APP_DATA.imoveis.filter(i => i.status === 'ativo').length;
  const emNegociacao = APP_DATA.imoveis.filter(i => i.status === 'em_negociacao').length;
  const buyers = APP_DATA.compradores.length;
  const termCount = APP_DATA.termosVisita.length;
  return `
    <section>
      <div class="section-head">
        <h2>Painel operacional</h2>
      </div>
      <div class="stats">
        <div class="stat"><strong>${ativos}</strong><span>Imóveis ativos</span></div>
        <div class="stat"><strong>${emNegociacao}</strong><span>Em negociação</span></div>
        <div class="stat"><strong>${buyers}</strong><span>Compradores</span></div>
        <div class="stat"><strong>${termCount}</strong><span>Termos de visita</span></div>
      </div>
      <div class="two-col">
        <div class="panel">
          <h3>Últimos compradores</h3>
          <ul class="list">
            ${APP_DATA.compradores.slice(-5).reverse().map(c => `<li>${c.nome} — ${findUser(c.corretorId)?.nome || '—'} — <span class="tag">${c.status}</span></li>`).join('')}
          </ul>
        </div>
        <div class="panel">
          <h3>Últimos leads</h3>
          <ul class="list">
            ${APP_DATA.leads.map(l => `<li>${l.nome} — ${findImovel(l.imovelId)?.codigo || ''} — <span class="tag">${l.status}</span></li>`).join('')}
          </ul>
        </div>
      </div>
    </section>
  `;
}

function renderImoveis() {
  return `
    <section>
      <div class="section-head">
        <h2>Cadastro e lista de imóveis</h2>
      </div>
      <div class="three-col">
        <div class="form-card">
          <h3>Novo imóvel</h3>
          <form id="form-imovel" onsubmit="submitImovel(event)">
            <div class="form-grid">
              <div class="field"><label>Código</label><input name="codigo" required placeholder="LN-021"></div>
              <div class="field"><label>Título</label><input name="titulo" required placeholder="Casa com varanda na SHIN QL 20"></div>
              <div class="field"><label>Endereço</label><input name="endereco" required placeholder="SHIN QL 20 Conjunto 1"></div>
              <div class="field"><label>Bairro</label><input name="bairro" value="Lago Norte" required></div>
              <div class="field"><label>Cidade</label><input name="cidade" value="Brasília" required></div>
              <div class="field"><label>Preço</label><input name="preco" type="number" min="1" required placeholder="1800000"></div>
              <div class="field"><label>Tipo</label><select name="tipo"><option>Casa</option></select></div>
              <div class="field"><label>Área (m²)</label><input name="area" type="number" min="1" required></div>
              <div class="field"><label>Quartos</label><input name="quartos" type="number" min="1" required></div>
              <div class="field"><label>Banheiros</label><input name="banheiros" type="number" min="1" required></div>
              <div class="field"><label>Vagas</label><input name="vagas" type="number" min="0" required></div>
              <div class="field"><label>Status</label><select name="status"><option value="ativo">ativo</option><option value="em_negociacao">em_negociacao</option></select></div>
              <div class="field"><label>Proprietário</label><select name="proprietarioId">${APP_DATA.proprietarios.filter(p=>p.ativo!==false).map(p=>`<option value="${p.id}">${p.nome}</option>`).join('')}</select></div>
              <div class="field"><label>Corretor responsável</label><select name="corretorId">${APP_DATA.usuarios.filter(u=>u.perfil==='corretor'&&u.ativo!==false).map(u=>`<option value="${u.id}">${u.nome}</option>`).join('')}</select></div>
              <div class="field full"><label>Imagem (URL)</label><input name="imagem" required value="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"></div>
            </div>
            <div class="form-actions"><button class="primary" type="submit">Salvar imóvel</button></div>
          </form>
        </div>
        <div class="table-card">
          <h3>Imóveis cadastrados</h3>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Código</th><th>Título</th><th>Endereço</th><th>Preço</th><th>Status</th><th>Corretor</th></tr></thead>
              <tbody>
                ${APP_DATA.imoveis.map(i=>`<tr><td>${i.codigo}</td><td>${i.titulo}</td><td>${i.endereco}</td><td>${currency.format(i.preco)}</td><td><span class="badge ${i.status}">${i.status}</span></td><td>${findUser(i.corretorId)?.nome || '—'}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderProprietarios() {
  return `
    <section>
      <div class="section-head">
        <h2>Cadastro e lista de proprietários</h2>
      </div>
      <div class="three-col">
        <div class="form-card">
          <h3>Novo proprietário</h3>
          <form id="form-proprietario" onsubmit="submitProprietario(event)">
            <div class="form-grid">
              <div class="field"><label>Tipo</label><select name="tipo"><option value="fisica">fisica</option><option value="juridica">juridica</option></select></div>
              <div class="field"><label>Nome / Razão social</label><input name="nome" required></div>
              <div class="field"><label>CPF / CNPJ</label><input name="cpf_cnpj" required></div>
              <div class="field"><label>Telefone</label><input name="telefone" required></div>
            </div>
            <div class="form-actions"><button class="primary" type="submit">Salvar proprietário</button></div>
          </form>
          <div class="helper">Os novos proprietários passam a aparecer imediatamente no formulário de imóveis.</div>
        </div>
        <div class="table-card">
          <h3>Proprietários cadastrados</h3>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Nome</th><th>Tipo</th><th>CPF/CNPJ</th><th>Telefone</th><th>Status</th></tr></thead>
              <tbody>
                ${APP_DATA.proprietarios.map(p=>`<tr><td>${p.nome}</td><td><span class="tag">${p.tipo}</span></td><td>${p.cpf_cnpj || '—'}</td><td>${p.telefone || '—'}</td><td>${p.ativo!==false ? 'ativo' : 'inativo'}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderTermos() {
  const corretorLogado = getCurrentUser();
  const firstImovel = APP_DATA.imoveis[0];
  return `
    <section>
      <div class="section-head">
        <h2>Cadastro e lista de termos de visita</h2>
      </div>
      <div class="three-col">
        <div class="form-card">
          <h3>Novo termo de visita</h3>
          <form id="form-termo" onsubmit="submitTermo(event)">
            <div class="form-grid">
              <div class="field full"><label>Imóvel (código)</label><select id="termo-imovel" name="imovelId" onchange="syncTermoPreview()" required>${APP_DATA.imoveis.filter(i=>i.ativo!==false).map(i=>`<option value="${i.id}">${i.codigo} — ${i.titulo}</option>`).join('')}</select></div>
              <div class="field full"><label>Endereço do imóvel</label><input id="termo-endereco" name="enderecoPreview" value="${firstImovel ? firstImovel.endereco : ''}" readonly></div>
              <div class="field full"><label>Comprador existente (opcional)</label><select id="termo-comprador" name="compradorId" onchange="syncCompradorNome()"><option value="">Selecionar comprador cadastrado</option>${APP_DATA.compradores.map(c=>`<option value="${c.id}">${c.nome}</option>`).join('')}</select></div>
              <div class="field full"><label>Nome do comprador</label><input id="termo-nome-comprador" name="nomeComprador" required placeholder="Nome do comprador"></div>
              <div class="field"><label>Valor da proposta (opcional)</label><input name="valorProposta" type="number" min="0" placeholder="0"></div>
              <div class="field"><label>Condições da proposta (opcional)</label><input name="condicoes" placeholder="Ex.: entrada de 30% e saldo financiado"></div>
              <div class="field full"><label>Corretor responsável</label><input value="${corretorLogado ? corretorLogado.nome : '—'}" readonly></div>
            </div>
            <div class="form-actions"><button class="primary" type="submit">Salvar termo de visita</button></div>
          </form>
        </div>
        <div class="table-card">
          <h3>Termos cadastrados</h3>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Imóvel</th><th>Comprador</th><th>Proposta</th><th>Status</th><th>Corretor</th></tr></thead>
              <tbody>
                ${APP_DATA.termosVisita.map(t=>{ const im = findImovel(t.imovelId); const broker = findUser(t.corretorId); return `<tr><td>${im?.codigo || '—'}<br><span class="meta">${im?.endereco || ''}</span></td><td>${t.nomeComprador}</td><td>${t.valorProposta ? currency.format(Number(t.valorProposta)) : '—'}</td><td><span class="badge ${t.status}">${t.status}</span></td><td>${broker?.nome || '—'}</td></tr>`; }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `;
}

function syncTermoPreview(){
  const select = document.getElementById('termo-imovel');
  const field = document.getElementById('termo-endereco');
  if (!select || !field) return;
  const imovel = findImovel(select.value);
  field.value = imovel ? imovel.endereco : '';
}

function syncCompradorNome(){
  const select = document.getElementById('termo-comprador');
  const field = document.getElementById('termo-nome-comprador');
  if (!select || !field) return;
  const comprador = findBuyer(select.value);
  if (comprador) field.value = comprador.nome;
}

function renderNegocios() {
  const termosDisponiveis = APP_DATA.termosVisita.filter(termoDisponivelParaNegocio);
  const termoInicial = termosDisponiveis[0];
  const imovelInicial = termoInicial ? findImovel(termoInicial.imovelId) : null;
  const proprietarioInicial = imovelInicial ? findOwner(imovelInicial.proprietarioId) : null;
  return `
    <section>
      <div class="section-head">
        <h2>Registro e lista de negócios fechados</h2>
      </div>
      <div class="three-col">
        <div class="form-card">
          <h3>Novo negócio fechado</h3>
          ${termosDisponiveis.length === 0 ? `<div class="empty">Não há termos disponíveis para conversão em negócio.</div>` : `
          <form id="form-negocio" onsubmit="submitNegocio(event)">
            <div class="form-grid">
              <div class="field full"><label>Termo de visita</label><select id="negocio-termo" name="termoVisitaId" onchange="syncNegocioPreview()" required>${termosDisponiveis.map(t=>{ const im=findImovel(t.imovelId); return `<option value="${t.id}">${im?.codigo || '—'} — ${t.nomeComprador}</option>`; }).join('')}</select></div>
              <div class="field full"><label>Imóvel</label><input id="negocio-imovel" value="${imovelInicial ? imovelInicial.codigo + ' — ' + imovelInicial.titulo : ''}" readonly></div>
              <div class="field full"><label>Comprador</label><input id="negocio-comprador" value="${termoInicial ? termoInicial.nomeComprador : ''}" readonly></div>
              <div class="field full"><label>Proprietário</label><input id="negocio-proprietario" value="${proprietarioInicial ? proprietarioInicial.nome : ''}" readonly></div>
              <div class="field"><label>Valor de fechamento</label><input id="negocio-valor" name="valorFechamento" type="number" min="1" value="${termoInicial && termoInicial.valorProposta ? Number(termoInicial.valorProposta) : ''}" required></div>
              <div class="field"><label>Data de fechamento</label><input name="dataFechamento" type="date" value="${todayISO()}" required></div>
              <div class="field full"><label>Condições de fechamento</label><input id="negocio-condicoes" name="condicoesFechamento" value="${termoInicial && termoInicial.condicoes ? termoInicial.condicoes : ''}"></div>
            </div>
            <div class="form-actions"><button class="primary" type="submit">Registrar negócio</button></div>
          </form>`}
        </div>
        <div class="table-card">
          <h3>Negócios registrados</h3>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Termo</th><th>Imóvel</th><th>Comprador</th><th>Fechamento</th><th>Data</th><th>Status</th></tr></thead>
              <tbody>
                ${APP_DATA.negocios.length === 0 ? `<tr><td colspan="6">Nenhum negócio registrado até o momento.</td></tr>` : APP_DATA.negocios.map(n=>{ const termo=findTermo(n.termoVisitaId); const im=findImovel(n.imovelId); return `<tr><td>${termo?.id || '—'}</td><td>${im?.codigo || '—'}</td><td>${n.nomeComprador || findBuyer(n.compradorId)?.nome || '—'}</td><td>${currency.format(Number(n.valorFechamento))}</td><td>${n.dataFechamento}</td><td><span class="badge ${n.status}">${n.status}</span></td></tr>`; }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `;
}

function syncNegocioPreview(){
  const termoId = document.getElementById('negocio-termo')?.value;
  const termo = findTermo(termoId);
  if (!termo) return;
  const imovel = findImovel(termo.imovelId);
  const proprietario = imovel ? findOwner(imovel.proprietarioId) : null;
  const imovelField = document.getElementById('negocio-imovel');
  const compradorField = document.getElementById('negocio-comprador');
  const proprietarioField = document.getElementById('negocio-proprietario');
  const valorField = document.getElementById('negocio-valor');
  const condField = document.getElementById('negocio-condicoes');
  if (imovelField) imovelField.value = imovel ? `${imovel.codigo} — ${imovel.titulo}` : '';
  if (compradorField) compradorField.value = termo.nomeComprador || '';
  if (proprietarioField) proprietarioField.value = proprietario ? proprietario.nome : '';
  if (valorField) valorField.value = termo.valorProposta ? Number(termo.valorProposta) : '';
  if (condField) condField.value = termo.condicoes || '';
}

function renderCompradores() {
  return `
    <section>
      <div class="section-head">
        <h2>Cadastro e lista de compradores</h2>
      </div>
      <div class="three-col">
        <div class="form-card">
          <h3>Novo comprador</h3>
          <form id="form-comprador" onsubmit="submitComprador(event)">
            <div class="form-grid">
              <div class="field"><label>Nome</label><input name="nome" required></div>
              <div class="field"><label>Telefone</label><input name="telefone" required></div>
              <div class="field"><label>E-mail</label><input name="email" type="email"></div>
              <div class="field"><label>Status</label><select name="status"><option value="ativo">ativo</option><option value="em_negociacao">em_negociacao</option><option value="perdido">perdido</option></select></div>
              <div class="field full"><label>Corretor responsável</label><select name="corretorId">${APP_DATA.usuarios.filter(u=>u.perfil==='corretor'&&u.ativo!==false).map(u=>`<option value="${u.id}">${u.nome}</option>`).join('')}</select></div>
            </div>
            <div class="form-actions"><button class="primary" type="submit">Salvar comprador</button></div>
          </form>
        </div>
        <div class="table-card">
          <h3>Compradores cadastrados</h3>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Nome</th><th>Telefone</th><th>E-mail</th><th>Status</th><th>Corretor</th></tr></thead>
              <tbody>
                ${APP_DATA.compradores.map(c=>`<tr><td>${c.nome}</td><td>${c.telefone}</td><td>${c.email || '—'}</td><td><span class="tag">${c.status}</span></td><td>${findUser(c.corretorId)?.nome || '—'}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderUsuarios() {
  if (!isDirector()) {
    return `
      <section>
        <div class="notice">Apenas usuários com perfil <strong>diretor</strong> podem cadastrar ou consultar a gestão completa de usuários.</div>
      </section>
    `;
  }
  return `
    <section>
      <div class="section-head">
        <h2>Cadastro e lista de usuários internos</h2>
      </div>
      <div class="three-col">
        <div class="form-card">
          <h3>Novo usuário</h3>
          <form id="form-usuario" onsubmit="submitUsuario(event)">
            <div class="form-grid">
              <div class="field"><label>Nome</label><input name="nome" required></div>
              <div class="field"><label>E-mail</label><input name="email" type="email" required></div>
              <div class="field"><label>Telefone</label><input name="telefone" required></div>
              <div class="field"><label>Senha</label><input name="senha" type="password" required placeholder="Senha inicial"></div>
              <div class="field"><label>Perfil</label><select name="perfil"><option value="corretor">corretor</option><option value="diretor">diretor</option></select></div>
            </div>
            <div class="form-actions"><button class="primary" type="submit">Salvar usuário</button></div>
          </form>
        </div>
        <div class="table-card">
          <h3>Usuários internos</h3>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Nome</th><th>E-mail</th><th>Telefone</th><th>Perfil</th><th>Status</th></tr></thead>
              <tbody>
                ${APP_DATA.usuarios.map(u=>`<tr><td>${u.nome}</td><td>${u.email}</td><td>${u.telefone || '—'}</td><td><span class="badge ${u.perfil}">${u.perfil}</span></td><td>${u.ativo!==false ? 'ativo' : 'inativo'}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderDados() {
  return `
    <section>
      <div class="section-head">
        <h2>Dados Gerais</h2>
      </div>
      <div class="two-col">
        <div class="panel">
          <h3>Resumo atual</h3>
          <ul class="list">
            <li>${APP_DATA.usuarios.filter(u=>u.perfil==='diretor').length} diretores</li>
            <li>${APP_DATA.usuarios.filter(u=>u.perfil==='corretor').length} corretores</li>
            <li>${APP_DATA.proprietarios.length} proprietários</li>
            <li>${APP_DATA.compradores.length} compradores</li>
            <li>${APP_DATA.imoveis.length} imóveis</li>
            <li>${APP_DATA.termosVisita.length} termos de visita</li>
            <li>${APP_DATA.negocios.length} negócios fechados</li>
          </ul>
          <div class="form-actions">
            <button class="secondary" onclick="resetData()">Restaurar dados iniciais</button>
          </div>
        </div>
        <div class="panel">
          <h3>Primeiro termo de visita</h3>
          ${APP_DATA.termosVisita.map(t => `
            <p><strong>${findImovel(t.imovelId).codigo}</strong> — ${t.nomeComprador}<br>
            Proposta: ${currency.format(t.valorProposta)}<br>
            Condições: ${t.condicoes}</p>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function submitImovel(event){
  event.preventDefault();
  const fd = new FormData(event.target);
  const codigo = String(fd.get('codigo')).trim();
  if (APP_DATA.imoveis.some(i => i.codigo.toLowerCase() === codigo.toLowerCase())) { alert('Código de imóvel já cadastrado.'); return; }
  APP_DATA.imoveis.push({
    id: nextId('i', APP_DATA.imoveis),
    codigo,
    titulo: String(fd.get('titulo')).trim(),
    endereco: String(fd.get('endereco')).trim(),
    bairro: String(fd.get('bairro')).trim(),
    cidade: String(fd.get('cidade')).trim(),
    preco: Number(fd.get('preco')),
    tipo: String(fd.get('tipo')).trim(),
    area: Number(fd.get('area')),
    quartos: Number(fd.get('quartos')),
    banheiros: Number(fd.get('banheiros')),
    vagas: Number(fd.get('vagas')),
    status: String(fd.get('status')).trim(),
    proprietarioId: String(fd.get('proprietarioId')),
    corretorId: String(fd.get('corretorId')),
    imagem: String(fd.get('imagem')).trim(),
    ativo: true
  });
  saveData();
  event.target.reset();
  setView('imoveis');
}

function submitNegocio(event){
  event.preventDefault();
  const fd = new FormData(event.target);
  const termoId = String(fd.get('termoVisitaId'));
  const termo = findTermo(termoId);
  if (!termo || !termoDisponivelParaNegocio(termo)) {
    alert('Termo inválido ou já convertido em negócio.');
    return;
  }
  const imovel = findImovel(termo.imovelId);
  const negocio = {
    id: nextId('n', APP_DATA.negocios),
    termoVisitaId: termo.id,
    imovelId: termo.imovelId,
    compradorId: termo.compradorId || null,
    nomeComprador: termo.nomeComprador,
    proprietarioId: imovel ? imovel.proprietarioId : null,
    corretorId: getCurrentUser()?.id || termo.corretorId || null,
    valorFechamento: Number(fd.get('valorFechamento')),
    condicoesFechamento: String(fd.get('condicoesFechamento')).trim(),
    dataFechamento: String(fd.get('dataFechamento')),
    status: 'fechado'
  };
  APP_DATA.negocios.push(negocio);
  termo.status = 'convertido_em_negocio';
  if (imovel) imovel.status = 'vendido';
  if (termo.compradorId) {
    const comprador = findBuyer(termo.compradorId);
    if (comprador) comprador.status = 'fechado';
  }
  saveData();
  event.target.reset();
  setView('negocios');
}

function submitProprietario(event){
  event.preventDefault();
  const fd = new FormData(event.target);
  const cpfCnpj = String(fd.get('cpf_cnpj')).trim();
  if (APP_DATA.proprietarios.some(p => String(p.cpf_cnpj || '').toLowerCase() === cpfCnpj.toLowerCase())) {
    alert('CPF/CNPJ já cadastrado.');
    return;
  }
  APP_DATA.proprietarios.push({
    id: nextId('p', APP_DATA.proprietarios),
    nome: String(fd.get('nome')).trim(),
    tipo: String(fd.get('tipo')).trim(),
    cpf_cnpj: cpfCnpj,
    telefone: String(fd.get('telefone')).trim(),
    ativo: true
  });
  saveData();
  event.target.reset();
  setView('proprietarios');
}

function submitTermo(event){
  event.preventDefault();
  const fd = new FormData(event.target);
  const imovelId = String(fd.get('imovelId'));
  const compradorId = String(fd.get('compradorId') || '');
  const nomeComprador = String(fd.get('nomeComprador')).trim();
  const valorProposta = String(fd.get('valorProposta')).trim();
  const valor = valorProposta ? Number(valorProposta) : null;
  APP_DATA.termosVisita.push({
    id: nextId('tv', APP_DATA.termosVisita),
    imovelId,
    compradorId: compradorId || null,
    nomeComprador,
    valorProposta: valor,
    condicoes: String(fd.get('condicoes')).trim(),
    corretorId: getCurrentUser()?.id || null,
    status: computeTermoStatus(valor)
  });
  saveData();
  event.target.reset();
  syncTermoPreview();
  setView('termos');
}

function submitComprador(event){
  event.preventDefault();
  const fd = new FormData(event.target);
  APP_DATA.compradores.push({
    id: nextId('c', APP_DATA.compradores),
    nome: String(fd.get('nome')).trim(),
    telefone: String(fd.get('telefone')).trim(),
    email: String(fd.get('email')).trim(),
    status: String(fd.get('status')).trim(),
    corretorId: String(fd.get('corretorId'))
  });
  saveData();
  event.target.reset();
  setView('compradores');
}

function submitUsuario(event){
  event.preventDefault();
  if (!isDirector()) return;
  const fd = new FormData(event.target);
  const email = String(fd.get('email')).trim().toLowerCase();
  if (APP_DATA.usuarios.some(u => u.email.toLowerCase() === email)) { alert('E-mail já cadastrado.'); return; }
  APP_DATA.usuarios.push({
    id: nextId('u', APP_DATA.usuarios),
    nome: String(fd.get('nome')).trim(),
    email,
    telefone: String(fd.get('telefone')).trim(),
    senha: String(fd.get('senha')).trim(),
    perfil: String(fd.get('perfil')).trim(),
    ativo: true
  });
  saveData();
  event.target.reset();
  setView('usuarios');
}

function changePassword(event){
  event.preventDefault();
  const user = getCurrentUser();
  if (!user) return;
  const atual = String(document.getElementById('senha-atual')?.value || '');
  const nova = String(document.getElementById('senha-nova')?.value || '');
  const confirmacao = String(document.getElementById('senha-confirmacao')?.value || '');
  state.passwordError='';
  state.passwordMessage='';
  if (atual !== user.senha) {
    state.passwordError='Senha atual incorreta.';
    render();
    return;
  }
  if (nova.length < 6) {
    state.passwordError='A nova senha deve ter pelo menos 6 caracteres.';
    render();
    return;
  }
  if (nova !== confirmacao) {
    state.passwordError='A confirmação da nova senha não confere.';
    render();
    return;
  }
  user.senha = nova;
  const idx = APP_DATA.usuarios.findIndex(u => u.id === user.id);
  if (idx >= 0) APP_DATA.usuarios[idx].senha = nova;
  saveData();
  state.passwordMessage='Senha alterada com sucesso.';
  render();
}

function render() {
  renderNav();
  const root = document.getElementById('app-root');
  if (state.selectedView === 'login') root.innerHTML = renderLogin();
  if (state.selectedView === 'senha') root.innerHTML = renderSenha();
  if (state.selectedView === 'home') root.innerHTML = renderHome();
  if (state.selectedView === 'dashboard') root.innerHTML = renderDashboard();
  if (state.selectedView === 'dados') root.innerHTML = renderDados();
  if (state.selectedView === 'detalhe') root.innerHTML = renderDetalhe();
  if (state.selectedView === 'imoveis') root.innerHTML = renderImoveis();
  if (state.selectedView === 'proprietarios') root.innerHTML = renderProprietarios();
  if (state.selectedView === 'termos') root.innerHTML = renderTermos();
  if (state.selectedView === 'negocios') root.innerHTML = renderNegocios();
  if (state.selectedView === 'compradores') root.innerHTML = renderCompradores();
  if (state.selectedView === 'usuarios') root.innerHTML = renderUsuarios();
}

window.addEventListener('DOMContentLoaded', () => { ensureSession(); render(); });
