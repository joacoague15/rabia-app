import VoiceRecognitionApp from "./VoiceRecognitionApp";
import rosaImg from "./assets/rosa.webp";

function App() {
  return (
    <div className="App">
        <div style={ styles.appContainer }>
            <div style={{ marginRight: 20 }}>
                <VoiceRecognitionApp />
            </div>
            <div style={{ marginTop: 40 }}>
                <img src={rosaImg} alt="rosa-img" style={styles.image} />
            </div>
        </div>
    </div>
  );
}

const styles = {
    appContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
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
        width: '350px',
        height: '550px',
    },
};

export default App;
