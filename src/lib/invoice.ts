// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfmake = require("pdfmake");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfFonts = require("pdfmake/build/vfs_fonts");

const vfs = pdfmake.virtualfs;
Object.keys(pdfFonts).forEach((fontName) => {
  vfs.storage[fontName] = Buffer.from(pdfFonts[fontName], "base64");
});

pdfmake.setFonts({
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-MediumItalic.ttf",
  },
});

const tableLayouts = {
  lightHorizontalLines: {
    hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
    vLineWidth: () => 0,
    hLineColor: () => "#e5e5e5",
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 4,
    paddingBottom: 4,
  },
};

pdfmake.addTableLayouts(tableLayouts);

export function generateInvoiceBuffer(order: {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  shipping_address: Record<string, any>;
  total: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  coupon_code?: string | null;
  discount?: number;
  order_items: { product_name: string; quantity: number; price: number }[];
}): Promise<Buffer> {
  const items: any[] = order.order_items.map((i, idx) => [
    (idx + 1).toString(),
    i.product_name,
    i.quantity.toString(),
    `\u20B9 ${i.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    `\u20B9 ${(i.price * i.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
  ]);

  if (order.discount) {
    items.push([
      "", "", "",
      { text: "Discount", color: "#16a34a", alignment: "right" },
      { text: `-\u20B9 ${order.discount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, color: "#16a34a" },
    ]);
  }

  items.push([
    "", "", "",
    { text: "Total", bold: true, alignment: "right" },
    { text: `\u20B9 ${order.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, bold: true },
  ]);

  const address = order.shipping_address || {};
  const addrLines = [
    address.line1 || address.street,
    [address.city, address.state].filter(Boolean).join(", "),
    address.pincode || address.zip,
  ].filter(Boolean);

  const doc: any = {
    pageSize: "A4",
    pageMargins: [40, 60, 40, 60],
    content: [
      { text: "INVOICE", style: "header", alignment: "right", margin: [0, 0, 0, 4] },
      { text: `#${order.id.slice(0, 8).toUpperCase()}`, alignment: "right", color: "#888", margin: [0, 0, 0, 20] },

      { text: "G-MART", style: "brand" },
      { text: "Premium Furniture", color: "#888", fontSize: 10, margin: [0, 0, 0, 20] },

      {
        columns: [
          {
            width: "50%",
            stack: [
              { text: "Bill To", style: "label" },
              { text: order.customer_name, margin: [0, 2, 0, 0] },
              { text: order.customer_email, fontSize: 9, color: "#555" },
              order.customer_phone ? { text: order.customer_phone, fontSize: 9, color: "#555" } : null,
            ].filter(Boolean),
          },
          {
            width: "50%",
            stack: [
              { text: "Ship To", style: "label" },
              ...addrLines.map((l: string) => ({ text: l, margin: [0, 2, 0, 0] })),
            ],
          },
        ],
        margin: [0, 0, 0, 20],
      },

      {
        columns: [
          { width: "50%", stack: [
            { text: "Order Date", style: "label" },
            { text: new Date(order.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }), margin: [0, 2, 0, 0] },
          ]},
          { width: "50%", stack: [
            { text: "Payment", style: "label" },
            { text: order.payment_method === "cashfree" ? "Online" : "Cash on Delivery", margin: [0, 2, 0, 0] },
          ]},
        ],
        margin: [0, 0, 0, 20],
      },

      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "auto", "auto"],
          body: [
            [{ text: "#", style: "tableHeader" }, { text: "Item", style: "tableHeader" }, { text: "Qty", style: "tableHeader", alignment: "center" }, { text: "Price", style: "tableHeader", alignment: "right" }, { text: "Amount", style: "tableHeader", alignment: "right" }],
            ...items,
          ],
        },
        layout: "lightHorizontalLines",
      },

      { text: `Status: ${order.status.toUpperCase()}`, margin: [0, 20, 0, 0], fontSize: 10, color: "#888" },
    ],
    styles: {
      header: { fontSize: 24, bold: true, color: "#1a1a1a" },
      brand: { fontSize: 18, bold: true, color: "#1a1a1a" },
      label: { fontSize: 9, bold: true, color: "#888" },
      tableHeader: { fontSize: 9, bold: true, color: "#555", fillColor: "#f5f5f5" },
    },
    defaultStyle: {
      font: "Roboto",
      fontSize: 10,
      color: "#333",
    },
  };

  const pdfDoc = pdfmake.createPdf(doc);
  return pdfDoc.getBuffer();
}
