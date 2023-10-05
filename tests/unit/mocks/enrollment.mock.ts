export const mockEnrollment1 = {
  id: 1,
  name: 'Nome do Cliente 1',
  cpf: '123.456.789-00',
  birthday: new Date('1990-01-01'),
  phone: '123-456-7890',
  userId: 123,
  Address: [
    {
      id: 1,
      cep: '12345-678',
      street: 'Rua Exemplo',
      city: 'Cidade Exemplo',
      state: 'Estado Exemplo',
      number: '123',
      neighborhood: 'Bairro Exemplo',
      addressDetail: 'Complemento Exemplo',
      enrollmentId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockEnrollment2 = {
  id: 2,
  name: 'Nome do Cliente 2',
  cpf: '987.654.321-00',
  birthday: new Date('1995-02-15'),
  phone: '987-654-3210',
  userId: 456,
  Address: [
    {
      id: 2,
      cep: '54321-876',
      street: 'Outra Rua',
      city: 'Outra Cidade',
      state: 'Outro Estado',
      number: '456',
      neighborhood: 'Outro Bairro',
      addressDetail: 'Complemento Outro',
      enrollmentId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};