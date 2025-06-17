const StatBox = ({ title, value, icon, color }) => {
    return (
      <div className={`rounded-md p-5 text-white shadow-md ${color}`}>
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-sm mt-1">{title}</div>
        <div className="absolute top-3 right-3 text-4xl opacity-30">{icon}</div>
      </div>
    );
  };
  
  export default StatBox;
  