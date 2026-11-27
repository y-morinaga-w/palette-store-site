"use strict";

const storeUrls = {
  "app-store": "",
  "google-play": "",
};

const messages = {
  ja: {
    app: "ぱれっとすとあ",
    title: "フレンドたいせんの招待",
    "code-label": "あいことば",
    copy: "あいことばをコピー",
    copied: "あいことばをコピーしました。",
    manual: "あいことばを選んでコピーしてね。",
    instructions: "アプリを入れたあと、このリンクをもう一度開くか、アプリの「フレンドたいせん」であいことばを入れてね。",
    expiry: "あいことばのきげんは10分だよ。",
    "invalid-message": "招待のリンクが正しくないようです",
    "invalid-help": "招待してくれた人に、もう一度リンクを送ってもらってね。",
  },
  en: {
    app: "Palette Store",
    title: "Friend Match invitation",
    "code-label": "Room code",
    copy: "Copy room code",
    copied: "Room code copied.",
    manual: "Select and copy the room code.",
    instructions: "After installing the app, open this link again or enter the room code in “Friend Match” in the app.",
    expiry: "The room code expires after 10 minutes.",
    "invalid-message": "This invitation link doesn’t look right",
    "invalid-help": "Ask your friend to send you the link again.",
  },
  "zh-Hans": {
    app: "调色铺",
    title: "好友对战邀请",
    "code-label": "房间口令",
    copy: "复制口令",
    copied: "已复制口令。",
    manual: "请选择并复制口令。",
    instructions: "安装应用后，再打开一次此链接，或在应用的「好友对战」中输入口令。",
    expiry: "口令的有效期为 10 分钟。",
    "invalid-message": "这个邀请链接好像不正确",
    "invalid-help": "请让邀请你的好友再发一次链接。",
  },
  "zh-Hant": {
    app: "調色舖",
    title: "好友對戰邀請",
    "code-label": "房間通關碼",
    copy: "複製通關碼",
    copied: "已複製通關碼。",
    manual: "請選取並複製通關碼。",
    instructions: "安裝應用程式後，再開啟一次此連結，或在應用程式的「好友對戰」中輸入通關碼。",
    expiry: "通關碼的有效期限為 10 分鐘。",
    "invalid-message": "這個邀請連結好像不正確",
    "invalid-help": "請邀請你的好友再傳一次連結。",
  },
  ko: {
    app: "팔레트 가게",
    title: "친구 대전 초대",
    "code-label": "방 코드",
    copy: "방 코드 복사",
    copied: "방 코드를 복사했어요.",
    manual: "방 코드를 선택해서 복사해 주세요.",
    instructions: "앱을 설치한 뒤 이 링크를 다시 열거나, 앱의 ‘친구 대전’에서 방 코드를 입력해 주세요.",
    expiry: "방 코드는 10분 뒤에 만료돼요.",
    "invalid-message": "초대 링크가 올바르지 않은 것 같아요",
    "invalid-help": "초대한 친구에게 링크를 다시 보내 달라고 해 주세요.",
  },
  es: {
    app: "Palette Store",
    title: "Invitación a una partida con amigos",
    "code-label": "Código de la sala",
    copy: "Copiar código",
    copied: "Código copiado.",
    manual: "Selecciona y copia el código.",
    instructions: "Después de instalar la app, vuelve a abrir este enlace o introduce el código en «Partida con amigos» dentro de la app.",
    expiry: "El código caduca a los 10 minutos.",
    "invalid-message": "Parece que este enlace de invitación no es válido",
    "invalid-help": "Pídele a tu amigo que te vuelva a enviar el enlace.",
  },
  fr: {
    app: "Palette Store",
    title: "Invitation à un duel entre amis",
    "code-label": "Code du salon",
    copy: "Copier le code",
    copied: "Code copié.",
    manual: "Sélectionne et copie le code.",
    instructions: "Après avoir installé l’application, ouvre de nouveau ce lien ou saisis le code dans « Duel entre amis » dans l’application.",
    expiry: "Le code expire au bout de 10 minutes.",
    "invalid-message": "Ce lien d’invitation semble incorrect",
    "invalid-help": "Demande à ton ami de te renvoyer le lien.",
  },
  de: {
    app: "Palette Store",
    title: "Einladung zum Spiel mit Freunden",
    "code-label": "Raumcode",
    copy: "Raumcode kopieren",
    copied: "Raumcode kopiert.",
    manual: "Markiere und kopiere den Raumcode.",
    instructions: "Installiere die App und öffne den Link erneut oder gib den Raumcode in der App unter „Mit Freunden spielen“ ein.",
    expiry: "Der Raumcode läuft nach 10 Minuten ab.",
    "invalid-message": "Dieser Einladungslink scheint ungültig zu sein",
    "invalid-help": "Bitte die Person, die dich eingeladen hat, dir den Link erneut zu schicken.",
  },
  "pt-BR": {
    app: "Palette Store",
    title: "Convite para uma partida com amigos",
    "code-label": "Código da sala",
    copy: "Copiar código",
    copied: "Código copiado.",
    manual: "Selecione e copie o código.",
    instructions: "Depois de instalar o app, abra este link de novo ou digite o código em “Partida com amigos” no app.",
    expiry: "O código expira em 10 minutos.",
    "invalid-message": "Este link de convite parece inválido",
    "invalid-help": "Peça à pessoa que convidou você para enviar o link de novo.",
  },
};

const nav = document.getElementById("languages");
const languageLinks = [...nav.querySelectorAll("a")];
const roomCode = document.getElementById("room-code");
const copyButton = document.getElementById("copy");
const feedback = document.getElementById("feedback");
const canCopy = typeof navigator.clipboard?.writeText === "function";

function browserLanguage() {
  for (const preference of navigator.languages || [navigator.language]) {
    const [language, ...subtags] = preference.toLowerCase().split("-");
    if (language === "zh") {
      if (subtags.includes("hans")) return "zh-Hans";
      if (subtags.some(tag => ["hant", "tw", "hk", "mo"].includes(tag))) return "zh-Hant";
      return "zh-Hans";
    }
    if (language === "pt") return "pt-BR";
    if (languageLinks.some(link => link.lang === language)) return language;
  }
  return "en";
}

function showLanguage() {
  const selected = languageLinks.find(link => link.hash === location.hash);
  const language = selected?.lang || browserLanguage();
  const text = messages[language];
  document.documentElement.lang = language;
  document.title = text.title + "｜" + text.app;

  for (const id of ["title", "app", "code-label", "copy", "instructions", "expiry", "invalid-message", "invalid-help"]) {
    document.getElementById(id).textContent = text[id];
  }
  for (const link of languageLinks) {
    if (link.lang === language) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }
  feedback.textContent = canCopy ? "" : text.manual;
}

const codes = new URLSearchParams(location.search).getAll("code");
const code = codes[0];
if (codes.length === 1 && code.length === 8 && /^[A-HJ-NP-Z2-9]{8}$/.test(code)) {
  roomCode.value = code;
  document.getElementById("invite").hidden = false;
  copyButton.hidden = !canCopy;
} else {
  document.getElementById("invalid").hidden = false;
}

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(roomCode.value);
    feedback.textContent = messages[document.documentElement.lang].copied;
  } catch {
    roomCode.focus();
    roomCode.select();
    feedback.textContent = messages[document.documentElement.lang].manual;
  }
});

for (const [id, url] of Object.entries(storeUrls)) {
  if (url) {
    const link = document.getElementById(id);
    link.href = url;
    link.hidden = false;
    document.getElementById("stores").hidden = false;
  }
}

showLanguage();
nav.hidden = false;
window.addEventListener("hashchange", showLanguage);
