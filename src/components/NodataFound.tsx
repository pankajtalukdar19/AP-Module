function NodataFound({ message = "No data found" }: { message?: string }) {
  return (
    <div
      className="text-center border border-round"
      style={{ height: "10rem", lineHeight: "10rem", fontSize: "0.9rem" }}
    >
      {message}
    </div>
  );
}

export default NodataFound;
