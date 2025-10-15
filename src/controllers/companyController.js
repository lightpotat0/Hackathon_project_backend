import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllCompanies = async (req, res) => {
  const companies = await prisma.company.findMany({
    include: { user: true },
  });
  res.json(companies);
};

export const getCompanyById = async (req, res) => {
  const { id } = req.params;
  const company = await prisma.company.findUnique({
    where: { id: parseInt(id) },
  });
  if (!company) return res.status(404).json({ message: "Empresa não encontrada" });
  res.json(company);
};

export const createCompany = async (req, res) => {
  const { name, description, website, logo_url, location, contact_email } = req.body;

  if (req.user.type !== "company")
    return res.status(403).json({ message: "Apenas empresas podem criar perfil" });

  const existingCompany = await prisma.company.findUnique({
    where: { user_id: req.user.id },
  });

  if (existingCompany)
    return res.status(400).json({ message: "Perfil da empresa já criado" });

  const company = await prisma.company.create({
    data: {
      name,
      description,
      website,
      logo_url,
      location,
      contact_email,
      user_id: req.user.id,
    },
  });

  res.status(201).json(company);
};

export const updateCompany = async (req, res) => {
  const { id } = req.params;
  const company = await prisma.company.findUnique({ where: { id: parseInt(id) } });

  if (!company) return res.status(404).json({ message: "Empresa não encontrada" });
  if (company.user_id !== req.user.id)
    return res.status(403).json({ message: "Acesso negado" });

  const updated = await prisma.company.update({
    where: { id: parseInt(id) },
    data: req.body,
  });

  res.json(updated);
};

export const deleteCompany = async (req, res) => {
  const { id } = req.params;
  const company = await prisma.company.findUnique({ where: { id: parseInt(id) } });

  if (!company) return res.status(404).json({ message: "Empresa não encontrada" });
  if (company.user_id !== req.user.id)
    return res.status(403).json({ message: "Acesso negado" });

  await prisma.company.delete({ where: { id: parseInt(id) } });
  res.json({ message: "Empresa deletada" });
};
