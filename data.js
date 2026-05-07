window.SEED_DATA = {
  usuarios: [
    { id: 'u1', nome: 'Ana Diretora', email: 'ana@renova.com', senha: 'Renova@123', perfil: 'diretor', ativo: true, telefone: '(61) 99999-1001' },
    { id: 'u2', nome: 'Bruno Diretor', email: 'bruno@renova.com', senha: 'Renova@123', perfil: 'diretor', ativo: true, telefone: '(61) 99999-1002' },
    { id: 'u3', nome: 'Carla Corretora', email: 'carla@renova.com', senha: 'Corretor@123', perfil: 'corretor', ativo: true, telefone: '(61) 99999-2001' },
    { id: 'u4', nome: 'Diego Corretor', email: 'diego@renova.com', senha: 'Corretor@123', perfil: 'corretor', ativo: true, telefone: '(61) 99999-2002' },
    { id: 'u5', nome: 'Eduarda Corretora', email: 'eduarda@renova.com', senha: 'Corretor@123', perfil: 'corretor', ativo: true, telefone: '(61) 99999-2003' },
    { id: 'u6', nome: 'Felipe Corretor', email: 'felipe@renova.com', senha: 'Corretor@123', perfil: 'corretor', ativo: true, telefone: '(61) 99999-2004' },
    { id: 'u7', nome: 'Gabriela Corretora', email: 'gabriela@renova.com', senha: 'Corretor@123', perfil: 'corretor', ativo: true, telefone: '(61) 99999-2005' }
  ],
  proprietarios: [
    { id: 'p1', nome: 'Carlos Silva', tipo: 'fisica', cpf_cnpj: '111.111.111-11', telefone: '(61) 4002-1001', ativo: true },
    { id: 'p2', nome: 'Marcos Oliveira', tipo: 'fisica', cpf_cnpj: '222.222.222-22', telefone: '(61) 4002-1002', ativo: true },
    { id: 'p3', nome: 'Fernanda Souza', tipo: 'fisica', cpf_cnpj: '333.333.333-33', telefone: '(61) 4002-1003', ativo: true },
    { id: 'p4', nome: 'Luciana Costa', tipo: 'fisica', cpf_cnpj: '444.444.444-44', telefone: '(61) 4002-1004', ativo: true },
    { id: 'p5', nome: 'Roberto Alves', tipo: 'fisica', cpf_cnpj: '555.555.555-55', telefone: '(61) 4002-1005', ativo: true },
    { id: 'p6', nome: 'Patrícia Moura', tipo: 'fisica', cpf_cnpj: '666.666.666-66', telefone: '(61) 4002-1006', ativo: true },
    { id: 'p7', nome: 'Henrique Teles', tipo: 'fisica', cpf_cnpj: '777.777.777-77', telefone: '(61) 4002-1007', ativo: true },
    { id: 'p8', nome: 'Juliana Campos', tipo: 'fisica', cpf_cnpj: '888.888.888-88', telefone: '(61) 4002-1008', ativo: true },
    { id: 'p9', nome: 'Ricardo Nogueira', tipo: 'fisica', cpf_cnpj: '999.999.999-99', telefone: '(61) 4002-1009', ativo: true },
    { id: 'p10', nome: 'Beatriz Sampaio', tipo: 'fisica', cpf_cnpj: '101.101.101-10', telefone: '(61) 4002-1010', ativo: true }
  ],
  compradores: [
    { id: 'c1', nome: 'Mariana Costa', telefone: '(61) 98888-3001', email: 'mariana@email.com', status: 'ativo', corretorId: 'u3' },
    { id: 'c2', nome: 'Thiago Nunes', telefone: '(61) 98888-3002', email: 'thiago@email.com', status: 'ativo', corretorId: 'u4' },
    { id: 'c3', nome: 'Fernanda Lima', telefone: '(61) 98888-3003', email: 'fernanda@email.com', status: 'em_negociacao', corretorId: 'u5' },
    { id: 'c4', nome: 'Rafael Azevedo', telefone: '(61) 98888-3004', email: 'rafael@email.com', status: 'ativo', corretorId: 'u6' },
    { id: 'c5', nome: 'Juliana Prado', telefone: '(61) 98888-3005', email: 'juliana@email.com', status: 'ativo', corretorId: 'u7' },
    { id: 'c6', nome: 'Lucas Faria', telefone: '(61) 98888-3006', email: 'lucas@email.com', status: 'ativo', corretorId: 'u3' },
    { id: 'c7', nome: 'Paula Ribeiro', telefone: '(61) 98888-3007', email: 'paula@email.com', status: 'perdido', corretorId: 'u4' },
    { id: 'c8', nome: 'Victor Teles', telefone: '(61) 98888-3008', email: 'victor@email.com', status: 'ativo', corretorId: 'u5' },
    { id: 'c9', nome: 'Aline Duarte', telefone: '(61) 98888-3009', email: 'aline@email.com', status: 'ativo', corretorId: 'u6' },
    { id: 'c10', nome: 'Roberto Sá', telefone: '(61) 98888-3010', email: 'roberto@email.com', status: 'ativo', corretorId: 'u7' }
  ],
  imoveis: [
    { id:'i1', codigo:'LN-001', titulo:'Casa contemporânea na SHIN QL 02', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 02 Conjunto 1', preco:1850000, tipo:'Casa', quartos:4, banheiros:5, vagas:3, area:320, status:'ativo', proprietarioId:'p1', corretorId:'u3', imagem:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80' },
    { id:'i2', codigo:'LN-002', titulo:'Casa térrea com jardim na SHIN QL 03', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 03 Conjunto 2', preco:1620000, tipo:'Casa', quartos:3, banheiros:4, vagas:2, area:280, status:'ativo', proprietarioId:'p2', corretorId:'u4', imagem:'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80' },
    { id:'i3', codigo:'LN-003', titulo:'Casa ampla com varanda na SHIN QL 04', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 04 Conjunto 3', preco:1980000, tipo:'Casa', quartos:5, banheiros:5, vagas:4, area:360, status:'em_negociacao', proprietarioId:'p3', corretorId:'u5', imagem:'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80' },
    { id:'i4', codigo:'LN-004', titulo:'Casa reformada na SHIN QL 05', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 05 Conjunto 4', preco:1730000, tipo:'Casa', quartos:4, banheiros:4, vagas:2, area:300, status:'ativo', proprietarioId:'p4', corretorId:'u6', imagem:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
    { id:'i5', codigo:'LN-005', titulo:'Casa com lazer na SHIN QL 06', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 06 Conjunto 1', preco:2140000, tipo:'Casa', quartos:5, banheiros:6, vagas:4, area:390, status:'ativo', proprietarioId:'p5', corretorId:'u7', imagem:'https://images.unsplash.com/photo-1600566753052-e5b43295b5e6?auto=format&fit=crop&w=1200&q=80' },
    { id:'i6', codigo:'LN-006', titulo:'Casa com piscina na SHIN QL 07', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 07 Conjunto 2', preco:2210000, tipo:'Casa', quartos:4, banheiros:5, vagas:4, area:410, status:'ativo', proprietarioId:'p6', corretorId:'u3', imagem:'https://images.unsplash.com/photo-1605146768851-eda79da39897?auto=format&fit=crop&w=1200&q=80' },
    { id:'i7', codigo:'LN-007', titulo:'Casa linear na SHIN QL 08', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 08 Conjunto 3', preco:1580000, tipo:'Casa', quartos:3, banheiros:3, vagas:2, area:250, status:'ativo', proprietarioId:'p7', corretorId:'u4', imagem:'https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=80' },
    { id:'i8', codigo:'LN-008', titulo:'Casa moderna na SHIN QL 09', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 09 Conjunto 4', preco:2360000, tipo:'Casa', quartos:5, banheiros:6, vagas:4, area:430, status:'ativo', proprietarioId:'p8', corretorId:'u5', imagem:'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80' },
    { id:'i9', codigo:'LN-009', titulo:'Casa familiar na SHIN QL 10', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 10 Conjunto 1', preco:1770000, tipo:'Casa', quartos:4, banheiros:4, vagas:3, area:315, status:'ativo', proprietarioId:'p9', corretorId:'u6', imagem:'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=1200&q=80' },
    { id:'i10', codigo:'LN-010', titulo:'Casa com escritório na SHIN QL 11', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 11 Conjunto 2', preco:1690000, tipo:'Casa', quartos:4, banheiros:4, vagas:2, area:295, status:'ativo', proprietarioId:'p10', corretorId:'u7', imagem:'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80' },
    { id:'i11', codigo:'LN-011', titulo:'Casa com gourmet na SHIN QL 12', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 12 Conjunto 3', preco:2050000, tipo:'Casa', quartos:5, banheiros:5, vagas:3, area:355, status:'ativo', proprietarioId:'p1', corretorId:'u3', imagem:'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80' },
    { id:'i12', codigo:'LN-012', titulo:'Casa de esquina na SHIN QL 13', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 13 Conjunto 4', preco:1830000, tipo:'Casa', quartos:4, banheiros:4, vagas:3, area:325, status:'ativo', proprietarioId:'p2', corretorId:'u4', imagem:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
    { id:'i13', codigo:'LN-013', titulo:'Casa com vista aberta na SHIN QL 14', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 14 Conjunto 1', preco:2240000, tipo:'Casa', quartos:5, banheiros:6, vagas:4, area:420, status:'ativo', proprietarioId:'p3', corretorId:'u5', imagem:'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80' },
    { id:'i14', codigo:'LN-014', titulo:'Casa compacta premium na SHIN QL 01', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 01 Conjunto 2', preco:1490000, tipo:'Casa', quartos:3, banheiros:3, vagas:2, area:240, status:'ativo', proprietarioId:'p4', corretorId:'u6', imagem:'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80' },
    { id:'i15', codigo:'LN-015', titulo:'Casa com anexo na SHIN QL 15', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 15 Conjunto 3', preco:2320000, tipo:'Casa', quartos:5, banheiros:6, vagas:4, area:445, status:'ativo', proprietarioId:'p5', corretorId:'u7', imagem:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
    { id:'i16', codigo:'LN-016', titulo:'Casa com pergolado na SHIN QL 05', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 05 Conjunto 5', preco:1710000, tipo:'Casa', quartos:4, banheiros:4, vagas:2, area:290, status:'ativo', proprietarioId:'p6', corretorId:'u3', imagem:'https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1200&q=80' },
    { id:'i17', codigo:'LN-017', titulo:'Casa com piscina aquecida na SHIN QL 16', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 16 Conjunto 1', preco:2450000, tipo:'Casa', quartos:5, banheiros:6, vagas:4, area:450, status:'ativo', proprietarioId:'p7', corretorId:'u4', imagem:'https://images.unsplash.com/photo-1605146768851-eda79da39897?auto=format&fit=crop&w=1200&q=80' },
    { id:'i18', codigo:'LN-018', titulo:'Casa elegante na SHIN QL 17', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 17 Conjunto 2', preco:1940000, tipo:'Casa', quartos:4, banheiros:5, vagas:3, area:335, status:'ativo', proprietarioId:'p8', corretorId:'u5', imagem:'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80' },
    { id:'i19', codigo:'LN-019', titulo:'Casa com home theater na SHIN QL 18', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 18 Conjunto 3', preco:2120000, tipo:'Casa', quartos:5, banheiros:5, vagas:3, area:365, status:'ativo', proprietarioId:'p9', corretorId:'u6', imagem:'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=1200&q=80' },
    { id:'i20', codigo:'LN-020', titulo:'Casa com área verde na SHIN QL 19', cidade:'Brasília', bairro:'Lago Norte', endereco:'SHIN QL 19 Conjunto 4', preco:1880000, tipo:'Casa', quartos:4, banheiros:4, vagas:3, area:318, status:'ativo', proprietarioId:'p10', corretorId:'u7', imagem:'https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=1200&q=80' }
  ],
  leads: [
    {id:'l1', nome:'Mariana Costa', telefone:'(61) 98888-3001', email:'mariana@email.com', imovelId:'i1', status:'novo'},
    {id:'l2', nome:'Thiago Nunes', telefone:'(61) 98888-3002', email:'thiago@email.com', imovelId:'i3', status:'em_contato'},
    {id:'l3', nome:'Fernanda Lima', telefone:'(61) 98888-3003', email:'fernanda@email.com', imovelId:'i7', status:'qualificado'}
  ],
  termosVisita: [
    {id:'tv1', imovelId:'i3', compradorId:'c3', nomeComprador:'Fernanda Lima', valorProposta:1920000, condicoes:'Entrada de 30% e saldo financiado.', corretorId:'u5', status:'com_proposta'}
  ],
  negocios: []
};
