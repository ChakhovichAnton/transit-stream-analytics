import Dots from "./Dots";

const Loading = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="animate-spin inline-block w-16 h-16 border-4 border-t-4 border-gray-300 rounded-full border-t-blue-600" />
      <p>
        Loading
        <Dots />
      </p>
    </div>
  );
};

export default Loading;
