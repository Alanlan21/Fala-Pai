import React, { useState, useRef, useEffect } from "react";

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

// Custom Input Modal Component for adding phrases
const InputModal = ({ title, placeholder, onConfirm, onCancel }) => {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    onConfirm(inputValue);
    setInputValue(""); // Clear input after confirming
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
            Adicionar
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

const AddLongTextModal = ({ onConfirm, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-left">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Nova Frase Longa
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
            Salvar
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
  // State for managing quick phrases
  const [quickPhrases, setQuickPhrases] = useState([
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
  ]);

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
  const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
  // A good Portuguese (Brazil) voice ID from ElevenLabs (e.g., Rafa)
  const ELEVENLABS_VOICE_ID = "oNn9BiqiwwzLKvft8EmY"; // You can change this to another voice ID if you have one

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

  // Handle input change
  const handleChange = (e) => {
    setInputText(e.target.value);
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

  // Handle adding a new quick phrase - opens the input modal
  const handleAddQuickPhrase = () => {
    setShowAddPhraseModal(true);
  };

  // Confirm adding a new phrase from the input modal
  const confirmAddPhrase = (newPhrase) => {
    if (newPhrase && newPhrase.trim()) {
      setQuickPhrases([...quickPhrases, newPhrase.trim()]);
    }
    setShowAddPhraseModal(false);
  };

  // Cancel adding a new phrase
  const cancelAddPhrase = () => {
    setShowAddPhraseModal(false);
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
          <button
            onClick={() => handlePlaybackToggle(inputText)} // Use generic toggle for main input
            className={`w-full text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition duration-300 ease-in-out text-xl
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
        </div>

        {/* Quick Phrases Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Frases Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {quickPhrases.map((phrase, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => handleQuickPhraseClick(phrase)}
                  className={`w-full text-white font-semibold py-3 px-4 rounded-xl shadow-md transform transition duration-200 ease-in-out text-md
                                                ${
                                                  isSpeaking && currentPlayingText !== phrase
                                                    ? "bg-gray-400 cursor-not-allowed" // Disable if another text is playing
                                                    : isSpeaking && currentPlayingText === phrase && !isPaused
                                                    ? "bg-orange-500 hover:bg-orange-600" // Pause color
                                                    : isSpeaking && currentPlayingText === phrase && isPaused
                                                    ? "bg-green-600 hover:bg-green-700" // Resume color
                                                    : "bg-blue-500 hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                }`}
                  disabled={isSpeaking && currentPlayingText !== phrase} // Disable button if another text is playing
                >
                  {isSpeaking && currentPlayingText === phrase && !isPaused
                    ? "Pausar"
                    : isSpeaking && currentPlayingText === phrase && isPaused
                    ? "Continuar"
                    : phrase}
                </button>
                <button
                  onClick={() => handleDeleteQuickPhrase(phrase)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                  title="Excluir frase"
                  disabled={isSpeaking} // Disable button while speaking
                >
                  X
                </button>
              </div>
            ))}
          </div>
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
              onClick={() => setShowAddLongTextModal(true)}
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
      </div>

      {/* Message Modal */}
      {modalMessage && (
        <MessageModal message={modalMessage} onClose={closeModal} />
      )}

      {/* Add Phrase Input Modal */}
      {showAddPhraseModal && (
        <InputModal
          title="Adicionar Nova Frase Rápida"
          placeholder="Digite a nova frase aqui..."
          onConfirm={confirmAddPhrase}
          onCancel={cancelAddPhrase}
        />
      )}

      {showAddLongTextModal && (
        <AddLongTextModal
          onConfirm={(newItem) => {
            setSavedTexts([...savedTexts, newItem]);
            setShowAddLongTextModal(false);
          }}
          onCancel={() => setShowAddLongTextModal(false)}
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
