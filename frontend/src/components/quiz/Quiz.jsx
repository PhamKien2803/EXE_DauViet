import Header from "../homepage/Header";
import { useState, useEffect } from "react";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(1);
  const [selected, setSelected] = useState({});
  const [time, setTime] = useState(5 * 60);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // fetch("http://localhost:9999/api/quiz")
    fetch("https://azure-dau-viet-function-bucwa3f7b2fjbnbh.eastus-01.azurewebsites.net/api/quiz")
      .then((res) => res.json())
      .then((resData) => {
        const formatted = resData.data.map((item) => ({
          question: item.question,
          options: item.options,
          correctAnswer: item.correctAnswer - 1,
          imageURL: item.imageURL,
        }));
        setQuestions(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (time > 0) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [time]);

  const handleOptionChange = (idx) => {
    setSelected({ ...selected, [current]: idx });
  };

  const handleFinishQuiz = () => {
    setShowResults(true);
  };

  const percent = Math.round((current / questions.length) * 100);
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-50">
        <p className="text-lg font-semibold text-gray-700">
          Đang tải câu hỏi...
        </p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-50">
        <p className="text-lg font-semibold text-red-600">
          Không có câu hỏi nào.
        </p>
      </div>
    );
  }

  if (showResults) {
    const correctCount = questions.reduce(
      (acc, q, idx) => acc + (selected[idx + 1] === q.correctAnswer ? 1 : 0),
      0
    );
    const percentCorrect = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="min-h-screen bg-yellow-50">
        <Header />
        <div className="max-w-2xl p-6 mx-auto mt-8 bg-white shadow-lg rounded-xl">
          <h2 className="mb-6 text-2xl font-bold">Kết quả Quiz</h2>
          <div className="flex items-center gap-4 p-4 mb-6 text-lg font-semibold text-green-700 border border-green-400 rounded-lg bg-green-50">
            <span>
              Đúng {correctCount} / {questions.length} câu
            </span>
            <span>( {percentCorrect}% )</span>
          </div>
          {questions.map((q, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="mb-2 text-lg font-semibold">
                Câu {idx + 1}: {q.question}
              </h3>
              {q.options.map((opt, optIdx) => (
                <div
                  key={optIdx}
                  className={`flex items-center p-3 border rounded-lg mb-2 ${selected[idx + 1] === optIdx &&
                    selected[idx + 1] !== q.correctAnswer
                    ? "border-red-500 bg-red-50 text-red-700"
                    : selected[idx + 1] === optIdx &&
                      selected[idx + 1] === q.correctAnswer
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 bg-white"
                    }`}
                >
                  <span className="mr-3">
                    {selected[idx + 1] === optIdx &&
                      selected[idx + 1] !== q.correctAnswer
                      ? "❌"
                      : selected[idx + 1] === optIdx &&
                        selected[idx + 1] === q.correctAnswer
                        ? "✅"
                        : ""}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {q.correctAnswer === optIdx &&
                    selected[idx + 1] !== q.correctAnswer && (
                      <span className="ml-3 text-green-600">
                        ✅ Đáp án đúng
                      </span>
                    )}
                </div>
              ))}
            </div>
          ))}
          <div className="mt-8">
            <button
              className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
              onClick={() => window.location.reload()}
            >
              Làm lại Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[current - 1];

  return (
    <div className="min-h-screen bg-yellow-50">
      <Header />
      <div className="max-w-2xl p-6 mx-auto mt-8 bg-white shadow-lg rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold">Quiz Dấu Việt</h2>
            <p className="text-sm text-gray-500">
              Kiểm tra kiến thức về thương hiệu Dấu Việt
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-100 rounded">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {formatTime(time)}
            </span>
            <span className="text-sm text-gray-600">
              Câu {current} / {questions.length}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Tiến độ</span>
            <span className="text-sm text-gray-600">{percent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-orange-500 h-2.5 rounded-full"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <div className="flex justify-center gap-2 mt-2">
            {questions.map((_, idx) => (
              <span
                key={idx}
                className={`w-7 h-7 flex items-center justify-center rounded-full border-2 text-sm font-bold ${idx + 1 === current
                  ? "bg-orange-500 text-white border-orange-500"
                  : selected[idx + 1] !== undefined
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-gray-100 text-gray-500 border-gray-300"
                  }`}
              >
                {idx + 1}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-4 text-lg font-semibold">
            Câu {current}: {currentQuestion.question}
          </h3>

          {currentQuestion.imageURL && (
            <img
              src={currentQuestion.imageURL}
              alt="Quiz"
              className="object-cover w-full mb-4 rounded max-h-60"
            />
          )}

          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => (
              <label
                key={idx}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${selected[current] === idx
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300 bg-white hover:bg-gray-50"
                  }`}
              >
                <input
                  type="radio"
                  name={`question-${current}`}
                  className="sr-only"
                  checked={selected[current] === idx}
                  onChange={() => handleOptionChange(idx)}
                />
                <span className="text-gray-800">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrent((c) => c - 1)}
            disabled={current === 1}
          >
            Quay lại
          </button>
          {current === questions.length ? (
            <button
              className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
              onClick={handleFinishQuiz}
            >
              Hoàn thành
            </button>
          ) : (
            <button
              className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600 disabled:opacity-50"
              onClick={() => setCurrent((c) => c + 1)}
              disabled={selected[current] === undefined}
            >
              Tiếp theo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
