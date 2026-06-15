export default function SourceCard({
  title,
  source
}) {

  return (

    <div
      className="glass"
      style={{
        padding: "15px",
        borderRadius: "14px",
        marginTop: "10px"
      }}
    >

      <h4>
        {title}
      </h4>

      <small
        style={{
          opacity: .7
        }}
      >
        {source}
      </small>

    </div>

  );

}