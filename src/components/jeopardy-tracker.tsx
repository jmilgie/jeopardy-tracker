import { useState, ChangeEvent, FC } from 'react';

const JeopardyTracker: FC = () => {
  const [score, setScore] = useState<number>(0);
  const [correct, setCorrect] = useState<number>(0);
  const [incorrect, setIncorrect] = useState<number>(0);
  const [wager, setWager] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isDailyDouble, setIsDailyDouble] = useState<boolean>(false);
  const [isFinalJeopardy, setIsFinalJeopardy] = useState<boolean>(false);
  const [wagerError, setWagerError] = useState<string>('');
  const [isRoundTwo, setIsRoundTwo] = useState<boolean>(false);

  const baseValues: number[] = [200, 400, 600, 800, 1000];
  const currentValues: number[] = isRoundTwo ? baseValues.map(v => v * 2) : baseValues;

  const handleScore = (amount: number | null, isCorrect: boolean) => {
    const scoreAmount = wager ? parseInt(wager, 10) : amount ?? 0;
    setScore(prev => prev + (isCorrect ? scoreAmount : -scoreAmount));
    if (isCorrect) {
      setCorrect(prev => prev + 1);
    } else {
      setIncorrect(prev => prev + 1);
    }
    setWager('');
    setWagerError('');
    setSelectedAmount(null);
    setIsDailyDouble(false);
  };

  const handleWagerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setWager('');
      setWagerError('');
      return;
    }
    const numValue = parseInt(value, 10);
    if (numValue > score) {
      setWagerError('Cannot wager more than current score');
    } else {
      setWagerError('');
    }
    setWager(value);
  };

  const handleRoundSwitch = () => {
    setIsRoundTwo(!isRoundTwo);
    setSelectedAmount(null);
    setIsDailyDouble(false);
    setWager('');
    setWagerError('');
  };

  const renderWagerInput = (): JSX.Element => (
    <div className="bg-blue-900 p-2 rounded-lg border-2 border-yellow-400 mb-2">
      <h3 className="text-yellow-400 text-lg mb-1 text-center">
        {isFinalJeopardy ? 'Final Jeopardy!' : 'Daily Double!'}
      </h3>
      <input
        type="number"
        value={wager}
        onChange={handleWagerChange}
        className="w-full p-1 mb-1 bg-blue-950 text-white border border-yellow-400 rounded"
        placeholder={`Max: $${score}`}
        max={score}
        min={0}
      />
      {wagerError && (
        <div className="text-red-400 text-xs mb-1">{wagerError}</div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleScore(selectedAmount, true)}
          className="bg-blue-800 text-yellow-400 p-1 rounded border border-yellow-400 disabled:opacity-50"
          disabled={Number(wager) > score || wager === ''}
        >
          Correct
        </button>
        <button
          onClick={() => handleScore(selectedAmount, false)}
          className="bg-blue-800 text-yellow-400 p-1 rounded border border-yellow-400 disabled:opacity-50"
          disabled={Number(wager) > score || wager === ''}
        >
          Incorrect
        </button>
      </div>
    </div>
  );

  const renderAmountWithActions = (amount: number): JSX.Element => {
    if (selectedAmount === amount && !isDailyDouble) {
      return (
        <div className="grid grid-cols-2 gap-1">
          <button
            className="bg-blue-800 text-yellow-400 p-2 rounded border border-yellow-400 text-sm"
            onClick={() => handleScore(amount, true)}
          >
            Correct
          </button>
          <button
            className="bg-blue-800 text-yellow-400 p-2 rounded border border-yellow-400 text-sm"
            onClick={() => handleScore(amount, false)}
          >
            Incorrect
          </button>
        </div>
      );
    }
    return (
      <button
        className="w-full bg-blue-900 text-yellow-400 p-2 rounded-lg border-2 border-yellow-400 text-lg font-bold"
        onClick={() => setSelectedAmount(amount)}
      >
        ${amount}
      </button>
    );
  };

  return (
    <div className="bg-blue-950 min-h-screen p-2">
      <h1 className="text-yellow-400 text-3xl font-bold text-center mb-2">JEOPARDY!</h1>
      
      <div className="text-white text-4xl font-bold text-center mb-2">
        ${score}
      </div>

      <div className="flex justify-center mb-3">
        <button
          className={`px-3 py-1 rounded-lg border-2 border-yellow-400 font-bold ${
            isRoundTwo ? 'bg-blue-900 text-yellow-400' : 'bg-yellow-400 text-blue-900'
          }`}
          onClick={handleRoundSwitch}
        >
          {isRoundTwo ? 'Double Jeopardy!' : 'Single Jeopardy'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-blue-900 p-2 rounded-lg text-center">
          <div className="text-yellow-400 text-sm">Incorrect</div>
          <div className="text-white text-xl">{incorrect}</div>
        </div>
        <div className="bg-blue-900 p-2 rounded-lg text-center">
          <div className="text-yellow-400 text-sm">Correct</div>
          <div className="text-white text-xl">{correct}</div>
        </div>
      </div>

      {(isDailyDouble || isFinalJeopardy) && renderWagerInput()}

      {!isDailyDouble && !isFinalJeopardy && (
        <div className="space-y-2">
          {currentValues.map(amount => (
            <div key={amount} className="grid grid-cols-4 gap-2">
              <button
                className="bg-blue-900 text-yellow-400 p-2 rounded-lg border-2 border-yellow-400 text-sm"
                onClick={() => {
                  setSelectedAmount(amount);
                  setIsDailyDouble(true);
                }}
              >
                Daily Double
              </button>
              <div className="col-span-3">
                {renderAmountWithActions(amount)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mt-3">
        <button
          className="bg-blue-900 text-yellow-400 p-2 rounded-lg border-2 border-yellow-400"
          onClick={() => {
            setScore(0);
            setCorrect(0);
            setIncorrect(0);
            setWager('');
            setWagerError('');
            setSelectedAmount(null);
            setIsDailyDouble(false);
            setIsFinalJeopardy(false);
            setIsRoundTwo(false);
          }}
        >
          Reset
        </button>
        <button
          className="bg-blue-900 text-yellow-400 p-2 rounded-lg border-2 border-yellow-400"
          onClick={() => {
            setIsFinalJeopardy(true);
            setSelectedAmount(0);
          }}
        >
          Final Jeopardy
        </button>
      </div>
    </div>
  );
};

export default JeopardyTracker;
