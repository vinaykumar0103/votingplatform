
import './Styles.css';
// import ConnectWalletButton from './components/ConnectWalletButton';
import VotingApp from './components/VotingApp';


const App = () => {
  return (
     <div className="flex flex-col items-center justify-center h-screen bg-cyan-950">
  <div className="container mx-auto p-8 bg-orange-100 rounded-lg shadow-lg flex flex-col items-center">
    <h1 className="text-3xl font-bold mb-4 text-center">Voting Platform</h1>

    {/* <ConnectWalletButton /> */}
    <VotingApp/>
  </div>
</div>

  )

};

export default App;
