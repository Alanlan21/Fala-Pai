1. Wake Lock — tela não pode apagar
Provavelmente a melhoria mais importante. Se o celular travar a tela no meio de uma conversa, o pai fica sem comunicação. A Wake Lock API impede isso enquanto o app está aberto.

2. Áudio no alto-falante, não no ear speaker
No celular, o new Audio() pode tocar no ear speaker (aquele speaker pequenininho de chamada). Precisa garantir que toque no alto-falante. Isso se controla adicionando um <audio> visível no DOM com playsInline e usando a tag HTML em vez de instanciar new Audio() via JS puro.

3. Fallback com Web Speech API
Se a internet cair ou a chave do ElevenLabs expirar, o pai fica mudo. Adicionar a SpeechSynthesis nativa do browser como fallback automático garante que ele sempre tenha uma voz, mesmo que de menor qualidade.

4. Botões de editar/excluir muito pequenos
Os botões de ✏️ e X nas frases rápidas têm w-7 h-7 (28px). Para um toque confortável no celular, o mínimo é 44px (recomendação da Apple/Google). Eles ficam difíceis de acertar, especialmente pós-cirurgia.

Importantes (melhoram muito a experiência)
5. Reorganizar o layout — frases rápidas primeiro
O fluxo real do pai é: "vejo uma frase pronta → clico → ela fala". Mas hoje o textarea enorme fica em cima e as frases ficam embaixo. Inverter a ordem tornaria o fluxo muito mais natural no celular.

6. Histórico de frases recentes
Um pequeno carrossel horizontal com as últimas 5–10 frases ditas (salvo no localStorage) permitiria repetir rapidamente sem procurar nas listas.

7. Controle de velocidade/estabilidade da voz
ElevenLabs aceita stability e similarity_boost no body. Um slider simples "Mais devagar / Normal / Mais rápido" (que ajusta stability) pode ajudar muito dependendo de quem está na conversa.

8. Feedback háptico ao falar
navigator.vibrate(200) quando o áudio começa é um feedback imediato que confirma que o app recebeu o toque — muito útil quando se está olhando para o interlocutor, não para a tela.

Legais de ter
9. Exportar/importar frases (backup)
Hoje tudo está no localStorage do celular. Se o app for reinstalado ou o cache for limpo, o pai perde todas as frases personalizadas que vocês construíram. Um botão de exportar/importar JSON resolveria isso.

10. Categorias de frases rápidas
Separar as frases em abas (ex: "Necessidades", "Família", "Saúde", "Outros") ajudaria a encontrar mais rápido, especialmente se a lista crescer.

11. Modo escuro
Para uso à noite no quarto ou hospital, um modo escuro reduziria o cansaço visual.

12. Pré-cache de áudio das frases fixas
Poderia gerar e cachear o áudio das frases rápidas mais usadas na primeira abertura do app. Assim elas tocam instantaneamente e funcionam offline.
