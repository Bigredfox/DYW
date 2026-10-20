const letters = [
  ['11110', '10001', '10001', '10001', '11110'],
  ['10001', '01010', '00100', '00100', '00100'],
  ['10001', '10001', '10101', '10101', '01010'],
];

export default function BlockWordmark() {
  return <svg className="brand-name" viewBox="0 0 136 40" width="109" height="32" role="img" aria-label="DYW">
    {letters.flatMap((rows, letter) => rows.flatMap((row, y) => [...row].map((cell, x) => cell === '1' &&
      <g key={`${letter}-${x}-${y}`} transform={`translate(${letter * 48 + x * 8} ${y * 8})`}>
        <rect width="7" height="7" fill="currentColor"/>
        <path d="M0 0h7v1H1v5H0Z" fill="#fff" opacity=".25"/>
        <path d="M1 6h5V1h1v6H1Z" fill="#000" opacity=".18"/>
      </g>
    )))}
  </svg>;
}
