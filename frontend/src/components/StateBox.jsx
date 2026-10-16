// লোডিং / এরর / খালি অবস্থা একই ছাঁচে দেখানোর ছোট কম্পোনেন্ট
export function Loading({ text = 'লোড হচ্ছে...' }) {
  return <p className="state-box" role="status">{text}</p>;
}

export function ErrorBox({ message }) {
  return <p className="state-box state-error" role="alert">{message}</p>;
}

export function Empty({ children }) {
  return <p className="state-box">{children}</p>;
}
