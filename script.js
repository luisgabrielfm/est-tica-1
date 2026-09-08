const pageData = {"treatments":{"Rosto":[{"name":"Limpeza de pele","vibe":"Um respiro para a pele","desc":"Cuidado facial voltado à limpeza e às necessidades da sua pele.","tag":"Cuidado facial","icon":"✳"},{"name":"Skinbooster","vibe":"Hidratação em pauta","desc":"Conheça essa opção em uma avaliação individual com profissional habilitado.","tag":"Avaliação individual","icon":"✧"},{"name":"Toxina botulínica","vibe":"Expressão com leveza","desc":"Converse sobre indicações, limites e expectativas para o seu rosto.","tag":"Planejamento personalizado","icon":"〰"}],"Corpo":[{"name":"Drenagem linfática","vibe":"Uma pausa para você","desc":"Conheça a técnica e descubra se ela faz sentido para o seu momento.","tag":"Cuidado corporal","icon":"〰"},{"name":"Massagem modeladora","vibe":"Seu corpo, seu cuidado","desc":"Uma conversa sobre objetivos vem antes de qualquer escolha de técnica.","tag":"Avaliação individual","icon":"✳"},{"name":"Criolipólise","vibe":"Informação antes de tudo","desc":"Entenda o procedimento, seus riscos e suas limitações com a equipe.","tag":"Indicação profissional","icon":"✧"}],"Cabelo":[{"name":"Avaliação capilar","vibe":"Vamos à raiz da questão","desc":"Um primeiro encontro para conversar sobre couro cabeludo, fios e rotina.","tag":"Primeiro passo","icon":"〰"},{"name":"Cuidados do couro cabeludo","vibe":"A base também importa","desc":"Um plano de cuidados começa entendendo as suas necessidades.","tag":"Plano individual","icon":"✳"},{"name":"Microagulhamento capilar","vibe":"Conheça suas opções","desc":"A indicação e os cuidados devem ser definidos por profissional habilitado.","tag":"Avaliação necessária","icon":"✧"}]},"steps":[{"title":"Primeiro, a gente te escuta.","text":"Você conta o que procura, como é sua rotina e quais são as suas dúvidas. Não precisa chegar sabendo o nome de nenhum tratamento."},{"title":"Cuidado com contexto.","text":"Um profissional habilitado avalia seu histórico e suas necessidades. Indicações, contraindicações e expectativas entram nessa conversa."},{"title":"Você decide com calma.","text":"O plano, os cuidados e os valores são explicados antes de começar. O próximo passo é uma escolha sua."}]};
/* Viva — JavaScript independente, sem React ou dependências externas. */
'use strict';

const dialog = document.querySelector('#viva-modal');
const title = document.querySelector('#modal-title');
const description = document.querySelector('#modal-description');
const content = document.querySelector('#modal-body');
let lastTrigger = null;
let step = 0;

function showDialog() {
  if (!dialog.open) {
    lastTrigger = document.activeElement;
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
}

function contact() {
  title.textContent = 'Vamos conversar?';
  description.textContent = 'O canal oficial da viva ainda está sendo preparado.';
  content.innerHTML = '<div class="contact-empty"><p>Nenhum telefone foi cadastrado nesta versão conceitual.</p></div><p>Quando o número oficial da clínica for adicionado, este botão abrirá a conversa no WhatsApp.</p><span class="fineprint">Nenhum agendamento foi realizado.</span>';
  showDialog();
}

function evaluation(reset = true) {
  if (reset) step = 0;
  title.textContent = 'Seu cuidado começa aqui.';
  description.textContent = 'Conheça os passos da avaliação.';
  content.innerHTML = `
    <div class="step-label" aria-live="polite">Etapa ${step + 1} de 3</div>
    <progress max="3" value="${step + 1}" aria-label="Etapa ${step + 1} de 3"></progress>
    <h3>${pageData.steps[step].title}</h3>
    <p>${pageData.steps[step].text}</p>
    <div class="dialog-actions">
      <button type="button" class="text-button" data-step="back" ${step === 0 ? 'disabled' : ''}>Voltar</button>
      <button type="button" class="button small" data-step="next">${step < 2 ? 'Próximo' : 'Consultar contato'}</button>
    </div>`;
  showDialog();
}

function treatment(name) {
  const item = Object.values(pageData.treatments).flat().find(item => item.name === name);
  if (!item) return;
  title.textContent = item.name;
  description.textContent = item.desc;
  content.innerHTML = '<p>Na avaliação, converse sobre suas expectativas, a indicação, possíveis riscos, cuidados e alternativas. Duração, sessões e valores são definidos individualmente.</p><div class="detail-note">✓ Primeiro, informação. Depois, sua escolha.</div><button type="button" class="button" data-action="evaluation">Como funciona a avaliação</button>';
  showDialog();
}

function selectTab(tab, focus = false) {
  document.querySelectorAll('[data-tab]').forEach(button => {
    const selected = button === tab;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
    button.toggleAttribute('data-active', selected);
  });
  document.querySelectorAll('[data-panel]').forEach(panel => {
    panel.hidden = panel.dataset.panel !== tab.dataset.tab;
  });
  if (focus) tab.focus();
}

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.tab) selectTab(button);
  if (button.dataset.treatment) treatment(button.dataset.treatment);
  if (button.dataset.action === 'contact') contact();
  if (button.dataset.action === 'evaluation') evaluation();
  if (button.dataset.step === 'back' && step > 0) {
    step--; evaluation(false);
    content.querySelector('[data-step="next"]').focus();
  }
  if (button.dataset.step === 'next') {
    if (step < 2) {
      step++; evaluation(false);
      content.querySelector('[data-step="next"]').focus();
    } else {
      contact();
      dialog.querySelector('.modal-close').focus();
    }
  }
});

document.querySelector('[role="tablist"]').addEventListener('keydown', event => {
  const tabs = [...document.querySelectorAll('[data-tab]')];
  const index = tabs.indexOf(document.activeElement);
  if (index < 0) return;
  let next;
  if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
  if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = tabs.length - 1;
  if (next !== undefined) { event.preventDefault(); selectTab(tabs[next], true); }
});

dialog.querySelector('.modal-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  if (lastTrigger?.isConnected) lastTrigger.focus();
});

// Carrossel de pares: troca o slide completo para nunca separar antes/depois.
const comparisonCarousel = document.querySelector('[data-static-carousel]');
if (comparisonCarousel) {
  const slides = [...comparisonCarousel.querySelectorAll('[data-case-index]')];
  const counter = comparisonCarousel.querySelector('.comparison-count');
  let currentCase = 0;
  function changeCase(direction) {
    currentCase = (currentCase + direction + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const active = index === currentCase;
      slide.hidden = !active;
      slide.setAttribute('aria-hidden', String(!active));
    });
    counter.textContent = `Simulação ${currentCase + 1} de ${slides.length}`;
  }
  comparisonCarousel.querySelectorAll('[data-case-direction]').forEach(button => {
    button.addEventListener('click', () => changeCase(Number(button.dataset.caseDirection)));
  });
  comparisonCarousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      changeCase(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
}

