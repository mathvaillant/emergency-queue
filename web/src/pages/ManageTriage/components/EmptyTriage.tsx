interface Props {
  onClick: () => void;
}

export function EmptyTriage({ onClick }: Props) {
  return (
    <div className="flex justify-center items-center w-full h-[80vh]">
      <button
        className="px-4 py-2 text-white bg-red-400 rounded-[15px] hover:bg-red-500 shadow-md"
        onClick={onClick}
      >
        <h1 className="text-sm font-bold">Create Triage Flow 🔗</h1>
      </button>
    </div>
  );
}
