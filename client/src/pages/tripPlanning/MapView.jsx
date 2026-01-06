const MapView = ({ city }) => {
  return (
    <div className="w-1/3 border-l h-screen">
      <iframe
        title="map"
        src={`https://www.google.com/maps?q=${encodeURIComponent(city)}&z=11&output=embed`}
        className="w-full h-full"
      />
    </div>
  );
};
export default MapView;