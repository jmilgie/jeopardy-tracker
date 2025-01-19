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
    // If a wager was entered, parse that; otherwise use amount (fall back to 0 if null).
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
    <div className="bg-blue-900 p-4 rounded-lg border-2 border-yellow-400 mb-4">
      <h3 className="text-yellow-400 text-xl mb-2 text-center">
        {isFinalJeopardy ? 'Final Jeopardy!' : 'Daily Double!'}
      </h3>
      <input
        type="number"
        value={wager}
        onChange={handleWagerChange}
        className="w-full p-2 mb-2 bg-blue-950 text-white border border-yellow-400 rounded"
        placeholder={`Max wager: $${score}`}
        max={score}
        min={0}
      />
      {wagerError && (
        <div className="text-red-400 text-sm mb-2">{wagerError}</div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleScore(selectedAmount, true)}
          className="bg-blue-800 text-yellow-400 p-2 rounded border border-yellow-400 disabled:opacity-50"
          disabled={Number(wager) > score || wager === ''}
        >
          Correct
        </button>
        <button
          onClick={() => handleScore(selectedAmount, false)}
          className="bg-blue-800 text-yellow-400 p-2 rounded border border-yellow-400 disabled:opacity-50"
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
        <div className="grid grid-cols-2 gap-2">
          <button
            className="bg-blue-800 text-yellow-400 p-4 rounded border border-yellow-400"
            onClick={() => handleScore(amount, true)}
          >
            Correct
          </button>
          <button
            className="bg-blue-800 text-yellow-400 p-4 rounded border border-yellow-400"
            onClick={() => handleScore(amount, false)}
          >
            Incorrect
          </button>
        </div>
      );
    }
    return (
      <button
        className="col-span-3 bg-blue-900 text-yellow-400 p-4 rounded-lg border-2 border-yellow-400 text-xl font-bold"
        onClick={() => setSelectedAmount(amount)}
      >
        ${amount}
      </button>
    );
  };

  return (
    <div className="bg-blue-950 min-h-screen p-4">
      <h1 className="text-yellow-400 text-4xl font-bold text-center mb-4">JEOPARDY!</h1>
      
      <div className="text-white text-5xl font-bold text-center mb-4">
        ${score}
      </div>

      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 rounded-lg border-2 border-yellow-400 font-bold ${
            isRoundTwo ? 'bg-blue-900 text-yellow-400' : 'bg-yellow-400 text-blue-900'
          }`}
          onClick={handleRoundSwitch}
        >
          {isRoundTwo ? 'Double Jeopardy!' : 'Single Jeopardy'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-900 p-4 rounded-lg text-center">
          <div className="text-yellow-400">Correct</div>
          <div className="text-white text-2xl">{correct}</div>
        </div>
        <div className="bg-blue-900 p-4 rounded-lg text-center">
          <div className="text-yellow-400">Incorrect</div>
          <div className="text-white text-2xl">{incorrect}</div>
        </div>
      </div>

      {(isDailyDouble || isFinalJeopardy) && renderWagerInput()}

      {!isDailyDouble && !isFinalJeopardy && (
        <div className="space-y-4">
          {currentValues.map(amount => (
            <div key={amount} className="grid grid-cols-4 gap-2">
              <div className="col-span-3">
                {renderAmountWithActions(amount)}
              </div>
              <button
                className="bg-blue-900 text-yellow-400 p-2 rounded-lg border-2 border-yellow-400 text-sm"
                onClick={() => {
                  setSelectedAmount(amount);
                  setIsDailyDouble(true);
                }}
              >
                Daily Double
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-6">
        <button
          className="bg-blue-900 text-yellow-400 p-4 rounded-lg border-2 border-yellow-400"
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
          className="bg-blue-900 text-yellow-400 p-4 rounded-lg border-2 border-yellow-400"
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