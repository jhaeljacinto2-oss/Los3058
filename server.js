const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Memoria temporal para guardar los chismes
let chismes = [
  { id: 1, texto: "¡Bienvenidos al chismefilter oficial de Los 3058!", comentarios: ["Firme causa", "Aea con todo"] }
];

// Servir la interfaz web
app.get('/', (req, res) => {
  let listaChismes = chismes.map(c => `
    <div style="background:#1e1e2e; padding:15px; margin-bottom:15px; border-radius:10px; border:1px solid #313244;">
      <p style="font-size:18px; color:#cdd6f4; margin:0 0 10px 0;">${c.texto}</p>
      <div style="margin-left:15px; border-left:2px solid #a6e3a1; padding-left:10px;">
        <h4 style="color:#a6e3a1; margin:5px 0;">Comentarios:</h4>
        ${c.comentarios.map(com => `<p style="color:#bac2de; margin:3px 0; font-size:14px;">• ${com}</p>`).join('')}
        
        <form action="/comentar" method="POST" style="margin-top:10px;">
          <input type="hidden" name="id" value="${c.id}">
          <input type="text" name="comentario" placeholder="Escribe un comentario anónimo..." required style="padding:6px; width:70%; border-radius:5px; border:none;">
          <button type="submit" style="padding:6px 12px; background:#a6e3a1; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">Comentar</button>
        </form>
      </div>
    </div>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Los 3058 - Chismes</title>
    </head>
    <body style="background:#11111b; color:#cdd6f4; font-family:sans-serif; max-width:600px; margin:20px auto; padding:0 10px;">
      <h1 style="text-align:center; color:#f5e0dc;">🔥 Los 3058 - Chismefilter 🔥</h1>
      
      <form action="/publicar" method="POST" style="background:#1e1e2e; padding:15px; border-radius:10px; margin-bottom:20px;">
        <h3>Soltar un chisme anónimo</h3>
        <textarea name="chisme" placeholder="Escribe el chisme completo aquí..." required style="width:95%; height:70px; padding:8px; border-radius:5px; border:none; margin-bottom:10px;"></textarea><br>
        <button type="submit" style="width:100%; padding:10px; background:#f38ba8; color:#11111b; font-weight:bold; border:none; border-radius:5px; cursor:pointer;">Publicar Chisme</button>
      </form>

      <h2>Últimos Chismes</h2>
      ${listaChismes}
    </body>
    </html>
  `);
});

// Guardar nuevo chisme
app.post('/publicar', (req, res) => {
  const nuevoChisme = req.body.chisme;
  if(nuevoChisme) {
    chismes.unshift({ id: Date.now(), texto: nuevoChisme, comentarios: [] });
  }
  res.redirect('/');
});

// Guardar nuevo comentario
app.post('/comentar', (req, res) => {
  const { id, comentario } = req.body;
  const chisme = chismes.find(c => c.id == id);
  if(chisme && comentario) {
    chisme.comentarios.push(comentario);
  }
  res.redirect('/');
});

app.listen(PORT, () => console.log('Servidor corriendo en el puerto ' + PORT));
