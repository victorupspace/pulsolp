import { jsPDF } from "jspdf";
import {
  formatCurrencyDetailed,
  formatDateLong,
  formatDocument,
  formatNumber,
} from "./format";
import type { Client, ClientProfile, ConsultorProfile, Simulation } from "./types";

type PdfInput = {
  simulation: Simulation;
  client: Client;
  profile?: ClientProfile | null;
  consultant?: ConsultorProfile | null;
};

type RGB = [number, number, number];

const PAGE = { width: 595.28, height: 841.89 };
const M = 54;
const CONTENT = PAGE.width - M * 2;

const VBL = {
  brand: {
    orange: [230, 81, 0] as RGB,
    orangeHover: [204, 72, 0] as RGB,
    orangeSoft: [252, 237, 229] as RGB,
    waveSoft: [245, 184, 148] as RGB,
  },
  surface: {
    DEFAULT: [242, 240, 238] as RGB,
    50: [250, 250, 250] as RGB,
  },
  ink: {
    900: [10, 10, 10] as RGB,
    800: [26, 26, 26] as RGB,
    700: [34, 34, 34] as RGB,
    600: [58, 58, 58] as RGB,
    500: [107, 107, 107] as RGB,
    400: [154, 154, 154] as RGB,
    300: [200, 200, 200] as RGB,
    200: [229, 229, 229] as RGB,
    100: [242, 242, 242] as RGB,
    50: [250, 250, 250] as RGB,
  },
  radius: {
    xs: 4,
    btn: 6,
    card: 8,
    panel: 12,
  },
  white: [255, 255, 255] as RGB,
};

const COLOR = {
  ink: VBL.ink[900],
  softInk: VBL.ink[600],
  muted: VBL.ink[500],
  light: VBL.ink[50],
  surface: VBL.surface.DEFAULT,
  line: VBL.ink[200],
  orange: VBL.brand.orange,
  orangeHover: VBL.brand.orangeHover,
  orangeSoft: VBL.brand.orangeSoft,
  waveSoft: VBL.brand.waveSoft,
  green: [24, 128, 69] as RGB,
  white: VBL.white,
};

export function createSimulationProposalPdf({ simulation, client, profile, consultant }: PdfInput) {
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const data = simulation.simulationData;
  const results = simulation.resultsData;
  const primaryUnit = profile?.units[0];
  const clientName = data.client.companyName || data.client.name || client.companyName || client.name;
  const consultantName = consultant?.fullName ?? "Consultor Pulso";
  const generatedAt = new Date().toISOString();

  doc.setProperties({
    title: `Proposta Pulso - ${clientName}`,
    subject: "Proposta de Economia no Mercado Livre de Energia",
    author: "Pulso",
    creator: "Pulso Plataforma",
  });

  drawCover(doc, {
    clientName,
    consultantName,
    createdAt: simulation.createdAt,
    distributor: data.client.distributor || client.distributor || primaryUnit?.distribuidora || "A definir",
    tariff: data.current.tariffModality || "A definir",
    consumption: data.current.averageConsumptionKwh,
  });

  doc.addPage();
  drawExecutive(doc, simulation, client, profile, consultantName);

  doc.addPage();
  drawClientAndCurrent(doc, simulation, client, profile);

  doc.addPage();
  drawProjectedAndComparison(doc, simulation);

  doc.addPage();
  drawClosing(doc);

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    drawFooter(doc, page, pageCount, generatedAt);
  }

  return doc.output("blob");
}

export function simulationPdfFileName(simulation: Simulation, client: Client) {
  const date = new Date(simulation.createdAt).toISOString().slice(0, 10);
  const name = (simulation.simulationData.client.companyName || client.companyName || client.name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLocaleLowerCase("pt-BR");
  return `proposta-pulso-${name || "cliente"}-${date}.pdf`;
}

export function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function drawCover(
  doc: jsPDF,
  input: {
    clientName: string;
    consultantName: string;
    createdAt: string;
    distributor: string;
    tariff: string;
    consumption: number;
  },
) {
  drawHeader(doc, "documento confidencial");

  overline(doc, "proposta de migração", M, 340, COLOR.orange);
  text(doc, "Proposta de Economia no Mercado Livre de Energia", M, 370, 24, "normal", COLOR.ink, {
    maxWidth: 395,
    lineHeight: 31,
  });
  microLabel(doc, "preparado para", M, 426);
  text(doc, input.clientName, M, 448, 16, "bold", COLOR.ink, { maxWidth: 390 });

  thinLine(doc, M, 496, PAGE.width - M, 496);
  coverField(doc, M, 524, "distribuidora atual", input.distributor);
  coverField(doc, M + 170, 524, "grupo tarifário", input.tariff);
  coverField(doc, M + 340, 524, "consumo médio", `${formatNumber(input.consumption)} kWh/mês`);

  doc.setFillColor(...COLOR.orange);
  doc.rect(M, 640, 44, 2, "F");
  text(doc, "clareza comercial para decisões de energia", M, 668, 9.5, "normal", COLOR.muted, {
    maxWidth: 250,
  });
  brandPill(doc, M, 704, "plataforma consultiva", "bg-surface / ink-900 / brand-orange");
  text(doc, input.consultantName, PAGE.width - M, 668, 9.5, "normal", COLOR.muted, {
    align: "right",
  });
  text(doc, `simulação em ${formatDateLong(input.createdAt)}`, PAGE.width - M, 684, 8, "normal", COLOR.muted, {
    align: "right",
  });
}

function drawExecutive(
  doc: jsPDF,
  simulation: Simulation,
  client: Client,
  profile: ClientProfile | null | undefined,
  consultantName: string,
) {
  const data = simulation.simulationData;
  const results = simulation.resultsData;
  drawHeader(doc, "resumo executivo");
  sectionTitle(doc, "Resumo Executivo", M, 118);
  text(
    doc,
    "Uma leitura objetiva da oportunidade econômica projetada para migração ao mercado livre de energia.",
    M,
    151,
    9.5,
    "normal",
    COLOR.muted,
    { maxWidth: 420, lineHeight: 14 },
  );

  metricCard(doc, M, 198, 153, "economia mensal", formatCurrencyDetailed(results.monthlySavings), "estimada", true);
  metricCard(doc, M + 167, 198, 153, "economia anual", formatCurrencyDetailed(results.annualSavings), "12 meses", false);
  metricCard(doc, M + 334, 198, 153, "redução", `${results.savingsPercent.toFixed(1)}%`, "versus cativo", true);

  const summaryY = 330;
  card(doc, M, summaryY, CONTENT, 150, "F");
  overline(doc, "condições principais", M + 22, summaryY + 31, COLOR.orange);
  keyValueGrid(doc, M + 22, summaryY + 59, [
    ["Prazo do contrato", `${data.projected.contractTermMonths} meses`],
    ["Tipo de contrato", data.projected.contractType ?? "A definir"],
    ["Fonte de energia", data.projected.energySource ?? "A definir"],
    ["Consultor responsável", consultantName],
  ], 2, 220);

  sectionTitle(doc, "Dados do Cliente", M, 545);
  const primaryUnit = profile?.units[0];
  keyValueGrid(doc, M, 586, [
    ["Nome/Razão social", data.client.companyName || data.client.name || client.name],
    ["CPF/CNPJ", formatDocument(data.client.document || profile?.document)],
    ["Email", data.client.email || client.email],
    ["Telefone", data.client.phone || client.phone],
    ["Endereço", data.client.address || "A definir"],
    ["Unidade consumidora", data.client.consumerUnit || primaryUnit?.ucCode || "A definir"],
    ["Distribuidora", data.client.distributor || client.distributor || primaryUnit?.distribuidora || "A definir"],
  ], 2, 230);
}

function drawClientAndCurrent(
  doc: jsPDF,
  simulation: Simulation,
  client: Client,
  profile: ClientProfile | null | undefined,
) {
  const data = simulation.simulationData;
  const primaryUnit = profile?.units[0];
  drawHeader(doc, "cenário atual");
  sectionTitle(doc, "Cenário Atual - Mercado Cativo", M, 118);

  card(doc, M, 160, CONTENT, 185, "F");
  keyValueGrid(doc, M + 22, 202, [
    ["Consumo médio", `${formatNumber(data.current.averageConsumptionKwh)} kWh/mês`],
    ["Custo mensal atual", formatCurrencyDetailed(data.current.monthlyCost)],
    ["Custo anual atual", formatCurrencyDetailed(data.current.annualCost)],
    ["Tarifa média", `${formatCurrencyDetailed(data.current.averageTariffMwh)} / MWh`],
    ["Demanda contratada", data.current.contractedDemandKw ? `${formatNumber(data.current.contractedDemandKw)} kW` : "A definir"],
    ["Distribuidora", data.client.distributor || client.distributor || primaryUnit?.distribuidora || "A definir"],
  ], 3, 143);

  sectionTitle(doc, "Componentes da fatura", M, 410);
  text(
    doc,
    "Composição estimada para orientar a conversa comercial. Os valores finais dependem da fatura validada.",
    M,
    443,
    9,
    "normal",
    COLOR.muted,
    { maxWidth: 410, lineHeight: 13 },
  );
  compositionBars(doc, M, 500, data.current.billComponents);

  card(doc, M, 650, CONTENT, 70, "S");
  overline(doc, "observação técnica", M + 18, 678, COLOR.orange);
  text(
    doc,
    "O custo no mercado cativo considera a conta mensal informada e uma composição média entre energia, fio, encargos e tributos.",
    M + 18,
    700,
    9,
    "normal",
    COLOR.softInk,
    { maxWidth: CONTENT - 36, lineHeight: 13 },
  );
}

function drawProjectedAndComparison(doc: jsPDF, simulation: Simulation) {
  const data = simulation.simulationData;
  const results = simulation.resultsData;
  drawHeader(doc, "mercado livre");

  sectionTitle(doc, "Cenário Projetado - Mercado Livre", M, 118);
  card(doc, M, 160, CONTENT, 172, "F");
  keyValueGrid(doc, M + 22, 201, [
    ["Custo mensal estimado", formatCurrencyDetailed(data.projected.monthlyCost)],
    ["Custo anual estimado", formatCurrencyDetailed(data.projected.annualCost)],
    ["Comercializadora", data.projected.commercializer ?? "A definir"],
    ["Tipo de energia", data.projected.energySource ?? "A definir"],
    ["Desconto aplicado", `${data.projected.discountPercent.toFixed(1)}%`],
    ["Tarifa estimada", `${formatCurrencyDetailed(data.projected.estimatedTariffMwh)} / MWh`],
  ], 3, 143);

  sectionTitle(doc, "Comparativo de Economia", M, 388);
  comparisonTable(doc, M, 425, [
    ["Mercado Cativo", formatCurrencyDetailed(data.current.monthlyCost), "-", "base"],
    ["Mercado Livre", formatCurrencyDetailed(data.projected.monthlyCost), formatCurrencyDetailed(results.monthlySavings), `${results.savingsPercent.toFixed(1)}%`],
    ["Projeção anual", formatCurrencyDetailed(data.current.annualCost), formatCurrencyDetailed(results.annualSavings), "economia"],
  ]);

  sectionTitle(doc, "Visualizações", M, 594);
  costBars(doc, M, 635, [
    ["Mercado Cativo", data.current.monthlyCost, COLOR.ink],
    ["Mercado Livre", data.projected.monthlyCost, COLOR.orange],
  ]);
  smallSavingsChart(doc, M + 292, 635, results.annualSavings);
}

function drawClosing(doc: jsPDF) {
  drawHeader(doc, "observações e próximos passos");
  sectionTitle(doc, "Observações Importantes", M, 118);
  note(doc, M, 164, "TUSD permanece sendo paga à distribuidora, conforme regras aplicáveis.");
  note(doc, M, 218, "Bandeiras tarifárias não incidem sobre a energia contratada no ACL.");
  note(doc, M, 272, "Valores são estimativas baseadas nos dados informados e nas premissas comerciais adotadas.");
  note(doc, M, 326, "Proposta sujeita a validação comercial, documental e regulatória.");

  doc.setFillColor(...COLOR.ink);
  doc.roundedRect(M, 430, CONTENT, 252, VBL.radius.panel, VBL.radius.panel, "F");
  overline(doc, "próximos passos", M + 28, 470, COLOR.orange);
  text(doc, "Caminho recomendado para avançar com segurança.", M + 28, 500, 18, "normal", COLOR.white, {
    maxWidth: 350,
    lineHeight: 23,
  });

  nextStep(doc, M + 28, 566, "01", "Validação dos dados", "Conferência da fatura, demanda, distribuidora e unidade consumidora.");
  nextStep(doc, M + 258, 566, "02", "Envio da proposta formal", "Ajuste fino das condições comerciais e compartilhamento com o cliente.");
  nextStep(doc, M + 28, 630, "03", "Assinatura contratual", "Formalização dos instrumentos necessários para contratação.");
  nextStep(doc, M + 258, 630, "04", "Início da migração", "Coordenação das etapas técnicas até a entrada no mercado livre.");
}

function drawHeader(doc: jsPDF, rightLabel: string) {
  pageCanvas(doc);
  brandLockup(doc, M, 61, 0.56);
  text(doc, rightLabel, PAGE.width - M, 59, 6.5, "normal", COLOR.muted, { align: "right" });
  thinLine(doc, M, 77, PAGE.width - M, 77);
}

function pageCanvas(doc: jsPDF) {
  doc.setFillColor(...COLOR.white);
  doc.rect(0, 0, PAGE.width, PAGE.height, "F");
  doc.setFillColor(...COLOR.surface);
  doc.rect(0, 0, 12, PAGE.height, "F");
  doc.setFillColor(...COLOR.orange);
  doc.rect(0, 0, 3, PAGE.height, "F");
}

function drawFooter(doc: jsPDF, page: number, total: number, generatedAt: string) {
  thinLine(doc, M, 770, PAGE.width - M, 770);
  text(doc, `gerado em ${formatDateLong(generatedAt)}`, M, 789, 6.5, "normal", COLOR.muted);
  text(doc, `página ${String(page).padStart(2, "0")} de ${String(total).padStart(2, "0")}`, PAGE.width - M, 789, 6.5, "normal", COLOR.muted, {
    align: "right",
  });
}

function brandLockup(doc: jsPDF, x: number, y: number, scale = 1) {
  waveMark(doc, x, y - 18 * scale, scale);
  text(doc, "pulso", x + 43 * scale, y, 18 * scale, "bold", COLOR.ink);
  text(doc, ".", x + 90 * scale, y, 18 * scale, "bold", COLOR.orange);
}

function waveMark(doc: jsPDF, x: number, y: number, scale = 1) {
  const width = 34 * scale;
  const amp = 3.8 * scale;
  const rowGap = 7.4 * scale;
  const lineWidth = 2.8 * scale;
  drawWave(doc, x, y, width, amp, COLOR.orange, lineWidth);
  drawWave(doc, x, y + rowGap, width, amp, COLOR.orangeHover, lineWidth);
  drawWave(doc, x, y + rowGap * 2, width, amp, COLOR.waveSoft, lineWidth);
}

function drawWave(doc: jsPDF, x: number, baseY: number, width: number, amp: number, color: RGB, lineWidth: number) {
  doc.setDrawColor(...color);
  doc.setLineWidth(lineWidth);
  doc.setLineCap("round");
  doc.setLineJoin("round");

  const points = 28;
  let prevX = x;
  let prevY = baseY;
  for (let i = 1; i <= points; i += 1) {
    const t = i / points;
    const nextX = x + t * width;
    const nextY = baseY - Math.sin(t * Math.PI * 2) * amp;
    doc.line(prevX, prevY, nextX, nextY);
    prevX = nextX;
    prevY = nextY;
  }

  doc.setLineCap("butt");
  doc.setLineJoin("miter");
}

function sectionTitle(doc: jsPDF, title: string, x: number, y: number) {
  text(doc, title, x, y, 17, "bold", COLOR.ink);
  doc.setFillColor(...COLOR.orange);
  doc.rect(x, y + 15, 42, 2, "F");
}

function metricCard(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  label: string,
  value: string,
  hint: string,
  highlight: boolean,
) {
  doc.setFillColor(...(highlight ? COLOR.orangeSoft : COLOR.light));
  doc.setDrawColor(...(highlight ? ([245, 184, 148] as RGB) : COLOR.line));
  doc.roundedRect(x, y, width, 92, VBL.radius.card, VBL.radius.card, "FD");
  overline(doc, label, x + 16, y + 28, highlight ? COLOR.orange : COLOR.muted);
  text(doc, value, x + 16, y + 58, value.length > 16 ? 12 : 14, "bold", highlight ? COLOR.orange : COLOR.ink, {
    maxWidth: width - 30,
  });
  text(doc, hint, x + 16, y + 76, 7.5, "normal", COLOR.muted);
}

function card(doc: jsPDF, x: number, y: number, width: number, height: number, style: "F" | "S") {
  doc.setFillColor(...COLOR.light);
  doc.setDrawColor(...COLOR.line);
  doc.roundedRect(x, y, width, height, VBL.radius.card, VBL.radius.card, style === "F" ? "FD" : "S");
}

function coverField(doc: jsPDF, x: number, y: number, label: string, value: string) {
  microLabel(doc, label, x, y);
  text(doc, value, x, y + 20, 8.2, "bold", COLOR.ink, { maxWidth: 130, lineHeight: 11 });
}

function brandPill(doc: jsPDF, x: number, y: number, label: string, value: string) {
  doc.setFillColor(...COLOR.surface);
  doc.setDrawColor(...COLOR.line);
  doc.roundedRect(x, y - 16, 244, 34, VBL.radius.btn, VBL.radius.btn, "FD");
  doc.setFillColor(...COLOR.orange);
  doc.circle(x + 15, y + 1, 3, "F");
  text(doc, label, x + 28, y - 1, 6.4, "bold", COLOR.muted, { charSpace: 0.65 });
  text(doc, value, x + 28, y + 12, 7.2, "normal", COLOR.softInk);
}

function keyValueGrid(doc: jsPDF, x: number, y: number, rows: [string, string][], columns: 2 | 3, colWidth: number) {
  rows.forEach(([label, value], index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const itemX = x + col * colWidth;
    const itemY = y + row * 54;
    microLabel(doc, label, itemX, itemY);
    text(doc, value || "A definir", itemX, itemY + 19, 8.8, "bold", COLOR.ink, {
      maxWidth: colWidth - 18,
      lineHeight: 11,
    });
  });
}

function comparisonTable(doc: jsPDF, x: number, y: number, rows: [string, string, string, string][]) {
  const widths = [146, 126, 122, 93];
  const headers = ["Cenário", "Custo mensal", "Diferença", "Economia"];
  doc.setFillColor(...COLOR.ink);
  doc.roundedRect(x, y, CONTENT, 34, VBL.radius.btn, VBL.radius.btn, "F");
  headers.forEach((header, index) => {
    text(doc, header, x + sum(widths, index) + 14, y + 22, 7, "bold", COLOR.white);
  });

  rows.forEach((row, rowIndex) => {
    const rowY = y + 34 + rowIndex * 38;
    doc.setFillColor(...(rowIndex % 2 === 0 ? COLOR.white : COLOR.light));
    doc.setDrawColor(...COLOR.line);
    doc.rect(x, rowY, CONTENT, 38, "FD");
    row.forEach((cell, colIndex) => {
      text(doc, cell, x + sum(widths, colIndex) + 14, rowY + 24, 8.3, colIndex === 0 ? "bold" : "normal", colIndex === 3 && rowIndex > 0 ? COLOR.orange : COLOR.ink, {
        maxWidth: widths[colIndex] - 18,
      });
    });
  });
}

function compositionBars(doc: jsPDF, x: number, y: number, components: { label: string; amount: number; percent: number }[]) {
  const palette = [COLOR.orange, COLOR.ink, [180, 180, 180] as RGB];
  let cursor = x;
  components.forEach((component, index) => {
    const width = Math.max(16, CONTENT * (component.percent / 100));
    doc.setFillColor(...palette[index % palette.length]);
    doc.rect(cursor, y, width, 16, "F");
    cursor += width;
  });
  components.forEach((component, index) => {
    const itemX = x + index * 162;
    doc.setFillColor(...palette[index % palette.length]);
    doc.rect(itemX, y + 42, 8, 8, "F");
    text(doc, component.label, itemX + 14, y + 49, 8.2, "bold", COLOR.ink, { maxWidth: 126 });
    text(doc, `${formatCurrencyDetailed(component.amount)} · ${component.percent.toFixed(0)}%`, itemX + 14, y + 65, 7.5, "normal", COLOR.muted, {
      maxWidth: 126,
    });
  });
}

function costBars(doc: jsPDF, x: number, y: number, rows: [string, number, RGB][]) {
  card(doc, x, y, 258, 112, "S");
  text(doc, "Comparativo de custos mensais", x + 18, y + 27, 10, "bold", COLOR.ink);
  const max = Math.max(...rows.map((row) => row[1]), 1);
  rows.forEach(([label, value, color], index) => {
    const rowY = y + 58 + index * 33;
    text(doc, label, x + 18, rowY, 8, "normal", COLOR.softInk);
    doc.setFillColor(...COLOR.line);
    doc.roundedRect(x + 118, rowY - 8, 88, 8, VBL.radius.xs, VBL.radius.xs, "F");
    doc.setFillColor(...color);
    doc.roundedRect(x + 118, rowY - 8, Math.max(8, 88 * (value / max)), 8, VBL.radius.xs, VBL.radius.xs, "F");
    text(doc, formatCurrencyDetailed(value), x + 240, rowY, 7.5, "bold", COLOR.ink, { align: "right" });
  });
}

function smallSavingsChart(doc: jsPDF, x: number, y: number, annualSavings: number) {
  card(doc, x, y, 195, 112, "S");
  text(doc, "Projeção de economia", x + 18, y + 27, 10, "bold", COLOR.ink);
  const values = [0.25, 0.5, 0.75, 1];
  values.forEach((factor, index) => {
    const height = 14 + factor * 44;
    const barX = x + 28 + index * 37;
    doc.setFillColor(...(index === values.length - 1 ? COLOR.orange : COLOR.line));
    doc.roundedRect(barX, y + 87 - height, 18, height, VBL.radius.btn, VBL.radius.btn, "F");
    text(doc, `${index + 1}º`, barX + 9, y + 99, 6.5, "normal", COLOR.muted, { align: "center" });
  });
  text(doc, formatCurrencyDetailed(annualSavings), x + 176, y + 59, 10.5, "bold", COLOR.orange, { align: "right" });
  text(doc, "em 12 meses", x + 176, y + 76, 7.2, "normal", COLOR.muted, { align: "right" });
}

function note(doc: jsPDF, x: number, y: number, body: string) {
  doc.setFillColor(...COLOR.orangeSoft);
  doc.setDrawColor(...[245, 184, 148]);
  doc.roundedRect(x, y - 22, CONTENT, 38, VBL.radius.card, VBL.radius.card, "FD");
  doc.setFillColor(...COLOR.orange);
  doc.circle(x + 18, y - 3, 3.5, "F");
  text(doc, body, x + 34, y + 1, 9.2, "normal", COLOR.softInk, { maxWidth: CONTENT - 54, lineHeight: 12 });
}

function nextStep(doc: jsPDF, x: number, y: number, number: string, title: string, body: string) {
  text(doc, number, x, y, 8, "bold", COLOR.orange);
  text(doc, title, x + 32, y, 9.8, "bold", COLOR.white, { maxWidth: 150 });
  text(doc, body, x + 32, y + 17, 7.2, "normal", [205, 205, 205], { maxWidth: 175, lineHeight: 10 });
}

function overline(doc: jsPDF, value: string, x: number, y: number, color: RGB) {
  text(doc, value.toLocaleUpperCase("pt-BR"), x, y, 6.8, "bold", color, { charSpace: 0.8 });
}

function microLabel(doc: jsPDF, value: string, x: number, y: number) {
  text(doc, value.toLocaleUpperCase("pt-BR"), x, y, 6.2, "normal", COLOR.muted, { charSpace: 0.45 });
}

function thinLine(doc: jsPDF, x1: number, y1: number, x2: number, y2: number) {
  doc.setDrawColor(...COLOR.line);
  doc.setLineWidth(0.8);
  doc.line(x1, y1, x2, y2);
}

function text(
  doc: jsPDF,
  value: string,
  x: number,
  y: number,
  size: number,
  weight: "normal" | "bold",
  color: RGB,
  options: { maxWidth?: number; lineHeight?: number; align?: "left" | "right" | "center"; charSpace?: number } = {},
) {
  doc.setFont("helvetica", weight);
  doc.setFontSize(size);
  doc.setTextColor(...color);
  doc.setCharSpace(options.charSpace ?? 0);
  const lines = options.maxWidth ? doc.splitTextToSize(value, options.maxWidth) : [value];
  doc.text(lines, x, y, {
    align: options.align ?? "left",
    lineHeightFactor: options.lineHeight ? options.lineHeight / size : 1.2,
  });
  if (options.charSpace) doc.setCharSpace(0);
}

function sum(values: number[], until: number) {
  return values.slice(0, until).reduce((acc, value) => acc + value, 0);
}
