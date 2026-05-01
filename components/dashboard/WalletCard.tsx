interface WalletProps {
  balance: number;
  title: string;
}

export default function WalletCard({ balance, title }: WalletProps) {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 shadow-lg shadow-purple-500/20 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
      <div>
        <h3 className="text-white/80 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold text-white mt-2">₹ {balance.toLocaleString()}</p>
      </div>
    </div>
  );
}