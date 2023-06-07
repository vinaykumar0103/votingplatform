
import './Styles.css';
import ConnectWalletButton from './components/ConnectWalletButton';
import CreateTopic from './components/CreateTopic';
import CreateOption from './components/CreateOption';
import Vote from './components/Vote';


const App = () => {
  return (
      <div className="flex flex-col items-center justify-center h-screen bg-cyan-950 ">
      <div className="container mx-auto p-8 bg-orange-100 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">Voting Platform</h1>

      <ConnectWalletButton />
 
      <CreateTopic />

      <CreateOption />

      <Vote /> 
    </div>
    </div>
  )

};

export default App;
