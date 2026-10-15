/* =====================================================================
   CONFIG: tudo que a Zagri precisa confirmar ou ajustar fica aqui.
   Textos que começam com "[EXEMPLO]" aparecem na página marcados em
   amarelo com a palavra "exemplo". Troque o texto e apague o "[EXEMPLO]".
   ===================================================================== */
const CONFIG = {
  // Endereço do site depois do deploy. Rode ./trocar-url.sh para trocar
  // também nas tags do <head> (og:image, canonical e JSON-LD).
  BASE_URL: "https://zagri-construtora.vercel.app",

  whatsapp: "5548996070194",

  // Link do perfil da Zagri no Google (aba de avaliações).
  googleReviewsUrl: "https://www.google.com/search?q=Zagri+Construtora+Palho%C3%A7a+avalia%C3%A7%C3%B5es",

  regioes: "[EXEMPLO] Palhoça, São José, Florianópolis, Biguaçu e Santo Amaro da Imperatriz",
  prazoMedio: "[EXEMPLO] De 8 a 12 meses para uma casa térrea de até 150 m²",
  financiamento: "[EXEMPLO] Sim. Ajudamos a aprovar o financiamento do terreno e da construção",

  etapas: [
    { titulo: "[EXEMPLO] Café e visita ao terreno", texto: "[EXEMPLO] Conversamos sobre a casa que você quer, o orçamento e olhamos o terreno juntos." },
    { titulo: "[EXEMPLO] Projeto sob medida", texto: "[EXEMPLO] Arquitetônico, estrutural, elétrico e hidrossanitário, com imagens 3D para você ver a casa antes da obra." },
    { titulo: "[EXEMPLO] Orçamento e cronograma", texto: "[EXEMPLO] Você recebe o custo e o cronograma físico-financeiro de cada etapa antes de assinar." },
    { titulo: "[EXEMPLO] Aprovação e financiamento", texto: "[EXEMPLO] Cuidamos da aprovação na prefeitura e, se precisar, do financiamento." },
    { titulo: "[EXEMPLO] Obra com acompanhamento", texto: "[EXEMPLO] Equipe própria na obra e atualizações frequentes com fotos do andamento." },
    { titulo: "[EXEMPLO] Entrega da chave e pós-venda", texto: "[EXEMPLO] Vistoria com você, entrega da casa e atendimento depois da mudança." }
  ],

  faixasInvestimento: [
    "[EXEMPLO] Até R$ 400 mil",
    "[EXEMPLO] De R$ 400 mil a R$ 600 mil",
    "[EXEMPLO] De R$ 600 mil a R$ 900 mil",
    "[EXEMPLO] Acima de R$ 900 mil",
    "Prefiro conversar sobre isso"
  ]
};

/* ===================================================================== */

(function () {
  "use strict";

  const MARCA = "[EXEMPLO]";
  const ehExemplo = (t) => typeof t === "string" && t.trim().startsWith(MARCA);
  const limpar = (t) => String(t).replace(MARCA, "").trim();

  // Escreve um texto do CONFIG num elemento, marcando se for exemplo.
  function escrever(el, texto) {
    el.textContent = "";
    if (ehExemplo(texto)) {
      const s = document.createElement("span");
      s.className = "exemplo";
      s.title = "Texto de exemplo: editar no CONFIG em script.js";
      s.textContent = limpar(texto);
      el.appendChild(s);
    } else {
      el.textContent = texto;
    }
  }

  /* ---------- Conteúdo vindo do CONFIG ---------- */
  document.querySelectorAll("[data-config]").forEach((el) => {
    const chave = el.dataset.config;
    if (chave === "etapas") return;
    if (CONFIG[chave] != null) escrever(el, CONFIG[chave]);
  });

  const listaEtapas = document.querySelector('[data-config="etapas"]');
  if (listaEtapas) {
    CONFIG.etapas.forEach((etapa) => {
      const li = document.createElement("li");
      li.className = "etapa";
      const h = document.createElement("h3");
      const p = document.createElement("p");
      escrever(h, etapa.titulo);
      escrever(p, etapa.texto);
      li.append(h, p);
      listaEtapas.appendChild(li);
    });
  }

  const select = document.getElementById("investimento");
  CONFIG.faixasInvestimento.forEach((faixa) => {
    const o = document.createElement("option");
    o.value = limpar(faixa);
    o.textContent = limpar(faixa);
    select.appendChild(o);
  });

  document.querySelectorAll("[data-config-href]").forEach((a) => {
    const url = CONFIG[a.dataset.configHref];
    if (url) a.href = url; else a.hidden = true;
  });

  const linkWhats = (texto) =>
    "https://wa.me/" + CONFIG.whatsapp + (texto ? "?text=" + encodeURIComponent(texto) : "");

  document.querySelectorAll("[data-whats]").forEach((a) => {
    a.href = linkWhats("Olá, Zagri! Vim pela página e quero conversar sobre construir minha casa.");
  });

  // Aviso para quem for publicar: og:image precisa bater com BASE_URL.
  const og = document.querySelector('meta[property="og:image"]');
  if (og && !og.content.startsWith(CONFIG.BASE_URL)) {
    console.warn("og:image não usa CONFIG.BASE_URL. Rode ./trocar-url.sh " + CONFIG.BASE_URL);
  }

  /* ---------- Galeria com ampliação ---------- */
  const dialog = document.getElementById("ampliar");
  const dImg = dialog.querySelector("img");
  const dLeg = dialog.querySelector("figcaption");
  let grupo = [];
  let atual = 0;
  let origem = null;

  function mostrar(i) {
    atual = (i + grupo.length) % grupo.length;
    const b = grupo[atual];
    dImg.src = b.dataset.full;
    dImg.alt = b.querySelector("img").alt;
    dLeg.textContent = b.dataset.legenda || "";
  }

  document.querySelectorAll("[data-galeria]").forEach((lista) => {
    const botoes = Array.from(lista.querySelectorAll(".galeria__botao"));
    botoes.forEach((b, i) => {
      b.setAttribute("aria-label", "Ampliar foto: " + (b.dataset.legenda || ""));
      b.addEventListener("click", () => {
        grupo = botoes;
        origem = b;
        mostrar(i);
        dialog.showModal();
      });
    });
  });

  dialog.querySelector(".ampliar__fechar").addEventListener("click", () => dialog.close());
  dialog.querySelector(".ampliar__nav--ant").addEventListener("click", () => mostrar(atual - 1));
  dialog.querySelector(".ampliar__nav--prox").addEventListener("click", () => mostrar(atual + 1));
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") mostrar(atual - 1);
    if (e.key === "ArrowRight") mostrar(atual + 1);
  });
  dialog.addEventListener("close", () => { if (origem) origem.focus(); });

  // Arrastar para o lado no celular troca a foto.
  let toqueX = null;
  dialog.addEventListener("touchstart", (e) => { toqueX = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener("touchend", (e) => {
    if (toqueX == null) return;
    const dx = e.changedTouches[0].clientX - toqueX;
    if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
    toqueX = null;
  });

  /* ---------- Formulário: ficha da casa ---------- */
  const form = document.getElementById("form-orcamento");
  const rotuloLocal = document.getElementById("rotulo-local");
  const inputLocal = document.getElementById("local");
  const resumo = document.getElementById("resumo-erros");

  const valorRadio = (nome) => {
    const r = form.querySelector('input[name="' + nome + '"]:checked');
    return r ? r.value : "";
  };

  // O rótulo do local acompanha a resposta sobre o terreno.
  form.querySelectorAll('input[name="terreno"]').forEach((r) => {
    r.addEventListener("change", () => {
      if (r.value === "Sim, já tenho") {
        rotuloLocal.textContent = "Bairro ou cidade do terreno";
        inputLocal.placeholder = "Ex.: Pedra Branca, Palhoça";
      } else {
        rotuloLocal.textContent = "Em que bairro ou cidade quer construir?";
        inputLocal.placeholder = "Ex.: Palhoça, perto da BR";
      }
    });
  });

  // Só números no campo de área.
  const inputArea = document.getElementById("area");
  inputArea.addEventListener("input", () => {
    inputArea.value = inputArea.value.replace(/\D/g, "").slice(0, 4);
  });

  const regras = {
    terreno: () => valorRadio("terreno") ? "" : "Conte se você já tem terreno. Isso muda bastante o orçamento.",
    local: () => inputLocal.value.trim().length >= 2 ? "" : "Escreva o bairro ou a cidade, mesmo que seja só uma ideia.",
    quartos: () => valorRadio("quartos") ? "" : "Escolha quantos quartos, ou toque em \"Não sei\".",
    area: () => {
      const v = inputArea.value.trim();
      if (!v) return "";
      const n = Number(v);
      return n >= 30 && n <= 2000 ? "" : "Use um número entre 30 e 2000 m², ou deixe em branco.";
    },
    investimento: () => select.value ? "" : "Escolha uma faixa de investimento. Se preferir, escolha \"Prefiro conversar sobre isso\".",
    inicio: () => valorRadio("inicio") ? "" : "Diga quando pretende começar. \"Só pesquisando\" também vale.",
    pagamento: () => valorRadio("pagamento") ? "" : "Escolha como pretende pagar, ou \"Ainda não sei\".",
    nome: () => document.getElementById("nome").value.trim().length >= 2 ? "" : "Escreva seu nome para a Zagri saber com quem está falando."
  };

  function validarCampo(chave) {
    const msg = regras[chave]();
    const campo = form.querySelector('[data-campo="' + chave + '"]');
    const erro = document.getElementById("erro-" + chave);
    campo.classList.toggle("tem-erro", !!msg);
    erro.textContent = msg;
    campo.querySelectorAll("input, select").forEach((el) => {
      if (msg) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
    });
    return !msg;
  }

  // Depois do primeiro erro, cada campo se corrige assim que é preenchido.
  Object.keys(regras).forEach((chave) => {
    const campo = form.querySelector('[data-campo="' + chave + '"]');
    campo.addEventListener("change", () => { if (campo.classList.contains("tem-erro")) validarCampo(chave); });
    campo.addEventListener("input", () => { if (campo.classList.contains("tem-erro")) validarCampo(chave); });
  });

  function montarMensagem() {
    const quartos = valorRadio("quartos");
    const area = inputArea.value.trim();
    let casa = quartos;
    if (area) casa = (quartos === "Ainda não sei" ? "Quartos ainda não definidos" : quartos) + ", cerca de " + area + " m²";
    const terreno = valorRadio("terreno");
    const rotulo = terreno === "Sim, já tenho" ? "Local do terreno" : "Onde quer construir";

    return [
      "Olá, Zagri! Quero construir minha casa. Segue minha ficha:",
      "",
      "*Nome:* " + document.getElementById("nome").value.trim(),
      "*Terreno:* " + terreno,
      "*" + rotulo + ":* " + inputLocal.value.trim(),
      "*Casa:* " + casa,
      "*Investimento:* " + select.value,
      "*Quando começar:* " + valorRadio("inicio"),
      "*Pagamento:* " + valorRadio("pagamento"),
      "",
      "Enviado pela página da Zagri."
    ].join("\n");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const invalidos = Object.keys(regras).filter((c) => !validarCampo(c));
    if (invalidos.length) {
      resumo.textContent = invalidos.length === 1
        ? "Falta só 1 resposta para enviar a ficha."
        : "Faltam " + invalidos.length + " respostas para enviar a ficha.";
      const primeiro = form.querySelector('[data-campo="' + invalidos[0] + '"]');
      primeiro.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      primeiro.querySelector("input, select").focus({ preventScroll: true });
      return;
    }
    resumo.textContent = "";
    const url = linkWhats(montarMensagem());
    window.__ultimaMensagemWhats = url; // usado nos testes
    window.open(url, "_blank", "noopener");
  });

  /* ---------- Botão flutuante some quando o formulário está na tela ---------- */
  // Fica escondido enquanto o botão da abertura ou o formulário estão na tela.
  const flutuante = document.querySelector(".whats-flutuante");
  if ("IntersectionObserver" in window) {
    const visiveis = new Set();
    const ctaAbertura = document.querySelector(".abertura__texto");
    new IntersectionObserver((entradas) => {
      entradas.forEach((en) => en.isIntersecting ? visiveis.add(en.target) : visiveis.delete(en.target));
      flutuante.classList.toggle("oculto", visiveis.size > 0);
    }, { threshold: 0.15 }).observe(form);
    flutuante.classList.add("oculto");
    new IntersectionObserver((entradas) => {
      entradas.forEach((en) => en.isIntersecting ? visiveis.add(en.target) : visiveis.delete(en.target));
      flutuante.classList.toggle("oculto", visiveis.size > 0);
    }, { threshold: 0.1 }).observe(ctaAbertura);
  }
})();
