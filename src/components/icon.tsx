export default function Icon({ path }: { path: string }) {
  return (
    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
      <path fill="var(--color-text)" d={path} />
    </svg>
  );
}
