import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; // Certifique-se de que esta biblioteca está instalada (npm install @hello-pangea/dnd)

// Custom Message Modal Component
const MessageModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <p className="text-gray-800 text-lg mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Entendi
        </button>
      </div>
    </div>
  );
};

// Custom Input Modal Component for adding/editing phrases
const InputModal = ({ title, placeholder, onConfirm, onCancel, initialValue = '' }) => {
  const [inputValue, setInputValue] = useState(initialValue);

  const handleConfirm = () => {
    onConfirm(inputValue);
    setInputValue(''); // Clear input after confirming
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w_sm w-full text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <input
          type="text"
          className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="flex justify-around">
          <button
            onClick={handleConfirm}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mr-2"
          >
            {initialValue ? 'Salvar Edição' : 'Adicionar'}
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ml-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom Confirmation Modal Component for deleting phrases
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <p className="text-gray-800 text-lg mb-4">{message}</p>
        <div className="flex justify-around">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mr-2"
          >
            Sim
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ml-2"
          >
            Não
          </button>
        </div>
      </div>
    </div>
  );
};

const AddLongTextModal = ({ onConfirm, onCancel, initialTitle = '', initialContent = '' }) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-left">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {initialTitle ? 'Editar Frase Longa' : 'Nova Frase Longa'}
        </h3>
        <input
          type="text"
          placeholder="Título"
          className="w-full p-2 border mb-3 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Digite o texto completo..."
          className="w-full p-2 border rounded h-32"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end mt-4 gap-2">
          <button
            className="bg-gray-400 px-4 py-2 rounded text-white"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="bg-green-600 px-4 py-2 rounded text-white"
            onClick={() => {
              if (title && content) onConfirm({ title, content });
            }}
          >
            {initialTitle ? 'Salvar Edição' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  // State for the text input by the user
  const [inputText, setInputText] = useState("");
  // State for managing quick phrases (carregadas do localStorage se disponíveis)
  const [quickPhrases, setQuickPhrases] = useState(() => {
    const saved = localStorage.getItem("quickPhrases");
    return saved ? JSON.parse(saved) : [
      "Alan, precisamos comprar banana",
      "Denis, você pode me ajudar?",
      "Preciso de ajuda, por favor.",
      "Estou com sede.",
      "Estou com fome.",
      "Sim",
      "Não",
      "Obrigado(a)",
      "Estou bem",
      "Não entendi",
    ];
  });

  const [savedTexts, setSavedTexts] = useState(() => {
    const saved = localStorage.getItem("savedTexts");
    return saved ? JSON.parse(saved) : [];
  });

  const [showAddLongTextModal, setShowAddLongTextModal] = useState(false);
  const [showDeleteLongTextConfirmModal, setShowDeleteLongTextConfirmModal] = useState(false);
  const [longTextToDelete, setLongTextToDelete] = useState(null);


  useEffect(() => {
    localStorage.setItem("savedTexts", JSON.stringify(savedTexts));
  }, [savedTexts]);

  // Effect to persist quick phrases to localStorage
  useEffect(() => {
    localStorage.setItem("quickPhrases", JSON.stringify(quickPhrases));
  }, [quickPhrases]);
  
  // State for loading status during speech synthesis
  const [isSpeaking, setIsSpeaking] = useState(false);
  // State to track if speech is currently paused
  const [isPaused, setIsPaused] = useState(false);
  // State to track the text currently being spoken
  const [currentPlayingText, setCurrentPlayingText] = useState(null);
  // State for modal message (general errors/info)
  const [modalMessage, setModalMessage] = useState(null);
  // State to control visibility of the add phrase input modal
  const [showAddPhraseModal, setShowAddPhraseModal] = useState(false);
  // State to control visibility of the delete confirmation modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  // State to store the phrase to be deleted
  const [phraseToDelete, setPhraseToDelete] = useState(null);
  // Ref for the text input area
  const inputRef = useRef(null);
  // Ref to store the Audio object for controlling playback
  const audioRef = useRef(null);

  // ElevenLabs API configuration
  // IMPORTANT: The API key will be provided by the Canvas environment at runtime.
  // Do NOT hardcode your actual API key here.
  const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY; // Ensure this is set in your environment variables
  // A good Portuguese (Brazil) voice ID from ElevenLabs (e.g., Rafa)
  const ELEVENLABS_VOICE_ID = "Iru1M1vQRERrzixU4SHr"; // You can change this to another voice ID if you have one

  // Removed AI Agent states and functions as per user request
  // const [aiPromptInput, setAiPromptInput] = useState('');
  // const [aiConversationHistory, setAiConversationHistory] = useState([]);
  // const [isAILoading, setIsAILoading] = useState(false);

  // Function to handle text-to-speech conversion using ElevenLabs
  const speakText = async (textToSpeak) => {
    if (!textToSpeak.trim()) {
      // Do not speak empty text
      return;
    }

    // If there's already audio playing, stop it before starting new speech
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset playback to start
        URL.revokeObjectURL(audioRef.current.src); // Clean up previous object URL
    }

    setIsSpeaking(true); // Set speaking state to true
    setIsPaused(false); // Ensure paused state is false when starting new speech
    setCurrentPlayingText(textToSpeak); // Set the text that is now playing

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY, // Your ElevenLabs API Key
            Accept: "audio/mpeg", // Requesting MP3 audio
          },
          body: JSON.stringify({
            text: textToSpeak,
            model_id: "eleven_multilingual_v2", // Using a multilingual model for better pt-BR support
            voice_settings: {
              stability: 0.75, // Adjust for more or less expressiveness
              similarity_boost: 0.75, // Adjust for more or less similarity to the base voice
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ElevenLabs API Error:", response.status, errorText);

        if (response.status === 401) {
          setModalMessage(
            "Erro de autenticação (401): A chave da API do ElevenLabs pode estar ausente ou inválida. Por favor, verifique a configuração do seu ambiente."
          );
        } else {
          setModalMessage(
            `Erro ao gerar a fala: ${response.status}. Por favor, tente novamente.`
          );
        }
        setIsSpeaking(false);
        setCurrentPlayingText(null); // Clear current playing text on error
        return;
      }

      // Get the audio data as a Blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play the audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio; // Store the audio object in the ref
      audio.play();

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl); // Clean up the object URL after playback
        setIsSpeaking(false); // Set speaking state to false when done
        setIsPaused(false); // Ensure paused state is false
        setCurrentPlayingText(null); // Clear current playing text
      };
      audio.onerror = (event) => {
        console.error("Audio playback error:", event);
        setModalMessage("Erro ao reproduzir o áudio. Tente novamente.");
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentPlayingText(null); // Clear current playing text on error
      };

    } catch (error) {
      console.error("Erro ao conectar com ElevenLabs:", error);
      setModalMessage(
        "Não foi possível conectar ao serviço de fala. Verifique sua conexão com a internet."
      );
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentPlayingText(null); // Clear current playing text on error
    }
  };

  // Handle input change for main text area
  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  // Function to clear the main input text
  const handleClearInput = () => {
    setInputText("");
    // Optionally, stop any ongoing speech if clearing the input
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      URL.revokeObjectURL(audioRef.current.src);
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentPlayingText(null);
    }
  };

  // Generic toggle function for play/pause/resume
  const handlePlaybackToggle = (text) => {
    if (isSpeaking && currentPlayingText === text) {
      // If currently speaking the same text
      if (isPaused) {
        // If paused, resume
        audioRef.current.play();
        setIsPaused(false);
      } else {
        // If playing, pause
        audioRef.current.pause();
        setIsPaused(true);
      }
    } else {
      // If not speaking, or speaking different text, start new speech
      speakText(text);
    }
  };

  // Handle quick phrase button click
  const handleQuickPhraseClick = (phrase) => {
    setInputText(phrase); // Set the phrase in the input
    handlePlaybackToggle(phrase); // Use the generic toggle
  };

  // Function to close the general message modal
  const closeModal = () => {
    setModalMessage(null);
  };

  // --- Quick Phrase Edit/Add Logic ---
  const [showEditQuickPhraseModal, setShowEditQuickPhraseModal] = useState(false);
  const [editingQuickPhrase, setEditingQuickPhrase] = useState(null); // Stores the phrase being edited

  // Handle adding a new quick phrase - opens the input modal
  const handleAddQuickPhrase = () => {
    setEditingQuickPhrase(null); // Ensure no phrase is being edited
    setShowAddPhraseModal(true);
  };

  // Handle editing a quick phrase - opens the input modal with current value
  const handleEditQuickPhrase = (phrase) => {
    setEditingQuickPhrase(phrase);
    setShowEditQuickPhraseModal(true);
  };

  // Confirm adding/editing a quick phrase from the input modal
  const confirmQuickPhrase = (newPhraseValue) => {
    if (newPhraseValue && newPhraseValue.trim()) {
      if (editingQuickPhrase) {
        // Editing existing phrase
        setQuickPhrases(prevPhrases =>
          prevPhrases.map(p => (p === editingQuickPhrase ? newPhraseValue.trim() : p))
        );
      } else {
        // Adding new phrase
        setQuickPhrases(prevPhrases => [...prevPhrases, newPhraseValue.trim()]);
      }
    }
    setShowAddPhraseModal(false);
    setShowEditQuickPhraseModal(false);
    setEditingQuickPhrase(null);
  };

  // Cancel adding/editing a quick phrase
  const cancelQuickPhraseModal = () => {
    setShowAddPhraseModal(false);
    setShowEditQuickPhraseModal(false);
    setEditingQuickPhrase(null);
  };

  // Handle deleting a quick phrase - opens the confirmation modal
  const handleDeleteQuickPhrase = (phrase) => {
    setPhraseToDelete(phrase);
    setShowDeleteConfirmModal(true);
  };

  // Confirm deleting a phrase from the confirmation modal
  const confirmDeletePhrase = () => {
    setQuickPhrases(quickPhrases.filter((phrase) => phrase !== phraseToDelete));
    setPhraseToDelete(null);
    setShowDeleteConfirmModal(false);
  };

  // Cancel deleting a phrase
  const cancelDeletePhrase = () => {
    setPhraseToDelete(null);
    setShowDeleteConfirmModal(false);
  };

  // --- Long Saved Text Edit/Add Logic ---
  const [showEditLongTextModal, setShowEditLongTextModal] = useState(false);
  const [editingLongText, setEditingLongText] = useState(null); // Stores the long text object being edited

  // Handle adding a new long text - opens the modal
  const handleAddLongText = () => {
    setEditingLongText(null); // Ensure no text is being edited
    setShowAddLongTextModal(true);
  };

  // Handle editing a long text - opens the modal with current values
  const handleEditLongText = (item) => {
    setEditingLongText(item);
    setShowEditLongTextModal(true);
  };

  // Confirm adding/editing a long text from the modal
  const confirmLongText = (newItemValue) => {
    if (newItemValue.title && newItemValue.content) {
      if (editingLongText) {
        // Editing existing long text
        setSavedTexts(prevTexts =>
          prevTexts.map(t => (t === editingLongText ? newItemValue : t))
        );
      } else {
        // Adding new long text
        setSavedTexts(prevTexts => [...prevTexts, newItemValue]);
      }
    }
    setShowAddLongTextModal(false);
    setShowEditLongTextModal(false);
    setEditingLongText(null);
  };

  // Cancel adding/editing a long text
  const cancelLongTextModal = () => {
    setShowAddLongTextModal(false);
    setShowEditLongTextModal(false);
    setEditingLongText(null);
  };

  // Handle deleting a long saved text - opens the confirmation modal
  const handleDeleteLongText = (item) => {
    setLongTextToDelete(item);
    setShowDeleteLongTextConfirmModal(true);
  };

  // Confirm deleting a long saved text from the confirmation modal
  const confirmDeleteLongText = () => {
    setSavedTexts(savedTexts.filter((item) => item !== longTextToDelete));
    setLongTextToDelete(null);
    setShowDeleteLongTextConfirmModal(false);
  };

  // Cancel deleting a long saved text
  const cancelDeleteLongText = () => {
    setLongTextToDelete(null);
    setShowDeleteLongTextConfirmModal(false);
  };

  // Drag and Drop Logic for Quick Phrases
  const onDragEnd = (result) => {
    if (!result.destination) return; // Dropped outside a droppable area

    const items = Array.from(quickPhrases);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQuickPhrases(items);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl text-center">
        {/* Título estilizado */}
        <h1 className="text-6xl font-extrabold mb-6" style={{
          background: 'linear-gradient(45deg, #8B5CF6, #EC4899)', /* Gradiente de roxo para rosa */
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)', /* Sombra sutil */
          letterSpacing: '0.05em' /* Espaçamento entre letras */
        }}>
          FalaPai
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Olá Carlos, sou seu assistente de comunicação inteligente.
        </p>

        {/* Text Input and Speak Button */}
        <div className="mb-8">
          <textarea
            ref={inputRef}
            className="w-full p-4 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 resize-y text-gray-800 text-lg mb-4 h-32"
            placeholder="Digite o que você quer dizer aqui..."
            value={inputText}
            onChange={handleChange}
            disabled={isSpeaking && !isPaused} // Disable input while speaking, but allow editing if paused
          ></textarea>
          <div className="flex gap-2 mt-4"> {/* Flex container for buttons */}
            <button
              onClick={() => handlePlaybackToggle(inputText)} // Use generic toggle for main input
              className={`flex-1 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition duration-300 ease-in-out text-xl
                                      ${
                                        isSpeaking && currentPlayingText === inputText && !isPaused
                                          ? "bg-orange-500 hover:bg-orange-600" // Pause color
                                          : isSpeaking && currentPlayingText === inputText && isPaused
                                          ? "bg-green-600 hover:bg-green-700" // Resume color
                                          : "bg-purple-600 hover:bg-purple-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                                      }`}
            >
              {isSpeaking && currentPlayingText === inputText && !isPaused
                ? "Pausar"
                : isSpeaking && currentPlayingText === inputText && isPaused
                ? "Continuar"
                : "Falar"}
              <svg
                className="inline-block ml-2 w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            {inputText && ( // Show clear button only when there's text
              <button
                onClick={handleClearInput}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition duration-300 ease-in-out text-xl flex-shrink-0"
                title="Limpar mensagem"
                disabled={isSpeaking} // Disable while speaking
              >
                Limpar
                <svg className="inline-block ml-2 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd"></path>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Quick Phrases Section */}
        <div className="mb-8">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="quickPhrases">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4"
                >
                  {quickPhrases.map((phrase, index) => (
                    <Draggable key={phrase} draggableId={phrase} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`relative rounded-xl shadow-md transform transition duration-200 ease-in-out
                                      ${snapshot.isDragging ? 'bg-blue-200 scale-105' : ''}
                                      ${isSpeaking && currentPlayingText !== phrase ? 'opacity-50' : ''}
                                      flex items-center gap-2 p-1`}
                          style={{ ...provided.draggableProps.style }}
                        >
                          {/* Drag Handle */}
                          <span
                            {...provided.dragHandleProps}
                            className="cursor-grab text-gray-400 hover:text-gray-600 select-none text-2xl px-2" // Styled handle
                            title="Arrastar"
                          >
                            ≡
                          </span>
                          <button
                            onClick={() => handleQuickPhraseClick(phrase)}
                            className={`flex-1 text-white font-semibold py-3 px-4 rounded-xl pr-[4.5rem] // Ajuste o padding-right para dar espaço aos botões
                                                ${
                                                  isSpeaking && currentPlayingText !== phrase
                                                    ? "bg-gray-400 cursor-not-allowed" // Disable if another text is playing
                                                    : isSpeaking && currentPlayingText === phrase && !isPaused
                                                    ? "bg-orange-500 hover:bg-orange-600" // Pause color
                                                    : isSpeaking && currentPlayingText === phrase && isPaused
                                                    ? "bg-green-600 hover:bg-green-700" // Resume color
                                                    : "bg-blue-500 hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                }
                                                overflow-hidden text-ellipsis whitespace-nowrap`}
                            disabled={isSpeaking && currentPlayingText !== phrase} // Disable button if another text is playing
                          >
                            {isSpeaking && currentPlayingText === phrase && !isPaused
                              ? "Pausar"
                              : isSpeaking && currentPlayingText === phrase && isPaused
                              ? "Continuar"
                              : phrase}
                          </button>
                          {/* Container para os botões de ação para melhor posicionamento */}
                          <div className="absolute top-1 right-1 flex gap-1">
                            {/* Edit button for Quick Phrases */}
                            <button
                              onClick={() => handleEditQuickPhrase(phrase)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold" // Ajustado w/h e text-sm
                              title="Editar frase"
                              disabled={isSpeaking}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteQuickPhrase(phrase)}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold" // Ajustado w/h e text-sm
                              title="Excluir frase"
                              disabled={isSpeaking} // Disable button while speaking
                            >
                              X
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <button
            onClick={handleAddQuickPhrase}
            className={`w-full text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition duration-300 ease-in-out text-xl
                                    ${
                                      isSpeaking
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-500 hover:bg-green-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
                                    }`}
            disabled={isSpeaking} // Disable button while speaking
          >
            Adicionar Nova Frase
            <svg
              className="inline-block ml-2 w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Frases Longas Salvas
          </h2>
          <div className="space-y-4">
            {savedTexts.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-xl shadow-md text-left relative"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-2 line-clamp-3">
                  {item.content}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePlaybackToggle(item.content)} // Use generic toggle for long texts
                    className={`text-white px-4 py-2 rounded
                                ${
                                  isSpeaking && currentPlayingText !== item.content
                                    ? "bg-gray-400 cursor-not-allowed" // Disable if another text is playing
                                    : isSpeaking && currentPlayingText === item.content && !isPaused
                                    ? "bg-orange-500 hover:bg-orange-600" // Pause color
                                    : isSpeaking && currentPlayingText === item.content && isPaused
                                    ? "bg-green-600 hover:bg-green-700" // Resume color
                                    : "bg-purple-600 hover:bg-purple-700"
                                }`}
                    disabled={isSpeaking && currentPlayingText !== item.content} // Disable button if another text is playing
                  >
                    {isSpeaking && currentPlayingText === item.content && !isPaused
                      ? "Pausar"
                      : isSpeaking && currentPlayingText === item.content && isPaused
                      ? "Continuar"
                      : "Falar"}
                  </button>
                  {/* Edit button for Long Saved Texts */}
                  <button
                    onClick={() => handleEditLongText(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    title="Editar frase longa"
                    disabled={isSpeaking}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteLongText(item)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                    title="Excluir frase longa"
                    disabled={isSpeaking} // Disable button while speaking
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddLongText}
              className="w-full text-white font-bold py-3 px-6 rounded-xl bg-green-600 hover:bg-green-700 transition"
              disabled={isSpeaking} // Disable button while speaking
            >
              Adicionar Frase Longa
            </button>
          </div>
        </div>


        {/* Footer */}
        <p className="text-gray-500 text-sm mt-8">
          Desenvolvido por <span className="text-red-500">Alan Regis</span> para
          facilitar a comunicação.
        </p>
        <p className="text-gray-400 text-xs mt-1">v1.0.3</p>
      </div>

      {/* Message Modal */}
      {modalMessage && (
        <MessageModal message={modalMessage} onClose={closeModal} />
      )}

      {/* Add/Edit Quick Phrase Modal */}
      {(showAddPhraseModal || showEditQuickPhraseModal) && (
        <InputModal
          title={editingQuickPhrase ? "Editar Frase Rápida" : "Adicionar Nova Frase Rápida"}
          placeholder="Digite a frase aqui..."
          initialValue={editingQuickPhrase || ''}
          onConfirm={confirmQuickPhrase}
          onCancel={cancelQuickPhraseModal}
        />
      )}

      {/* Add/Edit Long Text Modal */}
      {(showAddLongTextModal || showEditLongTextModal) && (
        <AddLongTextModal
          initialTitle={editingLongText ? editingLongText.title : ''}
          initialContent={editingLongText ? editingLongText.content : ''}
          onConfirm={confirmLongText}
          onCancel={cancelLongTextModal}
        />
      )}

      {/* Delete Confirmation Modal for Quick Phrases */}
      {showDeleteConfirmModal && (
        <ConfirmationModal
          message={`Tem certeza que deseja excluir "${phraseToDelete}"?`}
          onConfirm={confirmDeletePhrase}
          onCancel={cancelDeletePhrase}
        />
      )}

      {/* Delete Confirmation Modal for Long Saved Texts */}
      {showDeleteLongTextConfirmModal && (
        <ConfirmationModal
          message={`Tem certeza que deseja excluir a frase longa "${longTextToDelete?.title}"?`}
          onConfirm={confirmDeleteLongText}
          onCancel={cancelDeleteLongText}
        />
      )}
    </div>
  );
};

export default App;
