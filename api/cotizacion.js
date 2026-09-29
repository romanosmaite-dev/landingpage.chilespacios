/**
 * Recibe las cotizaciones de la landing y las reenvia por correo.
 *
 * Es una funcion serverless de Vercel: vive en tu propio dominio
 * (https://www.chilespacios.cl/api/cotizacion) y no depende de ningun
 * servicio de formularios. Solo usa Resend para despachar el correo.
 *
 * No tiene dependencias: usa el fetch que ya trae Node en Vercel.
 *
 * Variables de entorno (se configuran en Vercel, nunca en el codigo):
 *   RESEND_API_KEY  (obligatoria)  clave de https://resend.com
 *   MAIL_TO         (opcional)     destino; por defecto el correo de contacto
 *   MAIL_FROM       (opcional)     remitente; debe ser de un dominio verificado
 *                                  en Resend. Mientras no lo verifiques, deja
 *                                  el valor por defecto (onboarding@resend.dev).
 */

const DESTINO_POR_DEFECTO = 'contactochilespacios@gmail.com';
const REMITENTE_POR_DEFECTO = 'Chilespacios <onboarding@resend.dev>';
const LARGO_MAXIMO = 4000;

// Evita que un texto del formulario se interprete como HTML en el correo
function escapar(valor) {
  return String(valor == null ? '' : valor)
    .slice(0, LARGO_MAXIMO)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function esEmailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(valor || '').trim());
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Metodo no permitido.' });
  }

  // Vercel entrega el cuerpo ya interpretado cuando viene como JSON,
  // pero se contempla el caso de que llegue como texto.
  let datos = req.body;
  if (typeof datos === 'string') {
    try {
      datos = JSON.parse(datos);
    } catch (err) {
      return res.status(400).json({ error: 'No pudimos leer los datos del formulario.' });
    }
  }
  if (!datos || typeof datos !== 'object') {
    return res.status(400).json({ error: 'No pudimos leer los datos del formulario.' });
  }

  // Campo trampa: si viene lleno, es un robot. Se responde bien a proposito,
  // para que no note que fue descartado, pero no se envia ningun correo.
  if (String(datos._honey || '').trim() !== '') {
    return res.status(200).json({ success: true });
  }

  const nombre = String(datos.nombre || '').trim();
  const email = String(datos.email || '').trim();
  const telefono = String(datos.telefono || '').trim();
  const tipo = String(datos.tipo || '').trim();
  const mensaje = String(datos.mensaje || '').trim();

  if (!nombre || !email || !telefono) {
    return res.status(400).json({ error: 'Faltan datos obligatorios.' });
  }
  if (!esEmailValido(email)) {
    return res.status(400).json({ error: 'El email no es valido.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Falta configurar la clave en Vercel. Se registra en los logs del
    // servidor, pero al visitante no se le cuenta el detalle interno.
    console.error('Falta la variable de entorno RESEND_API_KEY');
    return res.status(500).json({ error: 'El envio no esta configurado.' });
  }

  const destino = process.env.MAIL_TO || DESTINO_POR_DEFECTO;
  const remitente = process.env.MAIL_FROM || REMITENTE_POR_DEFECTO;
  const asunto = `Cotizacion ${tipo || 'espacio'} - ${nombre}`;

  const filas = [
    ['Nombre', nombre],
    ['Email', email],
    ['Telefono', telefono],
    ['Espacio de interes', tipo || '(no indicado)'],
    ['Mensaje', mensaje || '(sin mensaje)']
  ];

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1f2937;max-width:600px">
      <h2 style="color:#16803C;margin:0 0 4px">Nueva cotizacion desde la web</h2>
      <p style="margin:0 0 16px;color:#6b7280;font-size:14px">chilespacios.cl</p>
      <table cellpadding="10" cellspacing="0" border="0" style="border-collapse:collapse;width:100%">
        ${filas.map(([etiqueta, valor], i) => `
          <tr style="background:${i % 2 ? '#ffffff' : '#f6f8f7'}">
            <td style="border:1px solid #e5e7eb;font-weight:bold;width:38%">${escapar(etiqueta)}</td>
            <td style="border:1px solid #e5e7eb">${escapar(valor).replace(/\n/g, '<br>')}</td>
          </tr>`).join('')}
      </table>
      <p style="margin-top:16px;font-size:13px;color:#6b7280">
        Responde a este correo y la respuesta le llegara directamente a ${escapar(nombre)}.
      </p>
    </div>`;

  const texto = filas.map(([etiqueta, valor]) => `${etiqueta}: ${valor}`).join('\n');

  try {
    const respuesta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: remitente,
        to: [destino],
        reply_to: email,          // responder el correo le escribe al cliente
        subject: asunto,
        html: html,
        text: texto
      })
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text().catch(() => '');
      console.error('Resend respondio', respuesta.status, detalle);
      return res.status(502).json({ error: 'No pudimos enviar el correo en este momento.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Fallo al contactar Resend:', err && err.message);
    return res.status(502).json({ error: 'No pudimos enviar el correo en este momento.' });
  }
};
