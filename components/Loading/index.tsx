const Loading = () => {
  return (
    <div className="absolute top-1/3 left-1/2">
      <div className="flex justify-center items-center">
        <div
          className="
                animate-spin
                rounded-full
                h-32
                w-32
                border-t-2 border-b-2 border-purple-500
              "
        />
      </div>
    </div>
  );
};
export default Loading;
