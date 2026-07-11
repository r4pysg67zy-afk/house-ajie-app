export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-5xl font-bold text-green-700 mb-3">
          🏡 房仲阿傑工具箱
        </h1>

        <p className="text-gray-600 text-xl mb-10">
          把買房變簡單。
        </p>

        <div className="grid md:grid-cols-2 gap-5">

          <button className="rounded-2xl bg-green-600 text-white p-6 text-xl font-semibold hover:bg-green-700 transition">
            🏠 房貸試算
          </button>

          <button className="rounded-2xl bg-blue-600 text-white p-6 text-xl font-semibold hover:bg-blue-700 transition">
            💰 買房成本
          </button>

          <button className="rounded-2xl bg-orange-500 text-white p-6 text-xl font-semibold hover:bg-orange-600 transition">
            🔄 換屋規劃
          </button>

          <button className="rounded-2xl bg-purple-600 text-white p-6 text-xl font-semibold hover:bg-purple-700 transition">
            📈 重購退稅
          </button>

        </div>

        <div className="mt-12 border-t pt-8">

          <h2 className="font-bold text-2xl">
            房仲阿傑
          </h2>

          <p className="text-gray-600 mt-2">
            有巢氏房屋｜淡水微笑濱海加盟店
          </p>

          <p className="mt-2">
            📞 0918-601125
          </p>

        </div>

      </div>
    </main>
  );
}