interface LoadingProps {
  message?: string;
}

export default function Loading({ message = '로딩 중' }: LoadingProps) {
  return <div className="loading">{message}</div>;
}

