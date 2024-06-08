import VoiceRecognitionApp from "./VoiceRecognitionApp";
import rosaImg from "./assets/rosa.webp";

function App() {
  return (
    <div className="App">
      <VoiceRecognitionApp />
      <img src={rosaImg} alt="rosa-img" style={styles.image} />
    </div>
  );
}

const styles = {
    container: {
        textAlign: 'center',
        marginTop: '50px',
        position: 'relative',
        width: '100%',
        height: '50vh',
    },
    input: {
        marginBottom: '20px',
        width: '300px',
    },
    button: {
        marginBottom: '20px',
    },
    image: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '60%',
        maxHeight: '60%',
    },
};

export default App;
