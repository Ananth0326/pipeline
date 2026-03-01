import { Fragment, ReactNode } from 'react';

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<Fragment key={`text-${key++}`}>{text.slice(lastIndex, match.index)}</Fragment>);
    }

    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(<strong key={`bold-${key++}`}>{token.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={`italic-${key++}`}>{token.slice(1, -1)}</em>);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(<Fragment key={`text-${key++}`}>{text.slice(lastIndex)}</Fragment>);
  }

  return nodes;
}

export default function FormattedText({ text }: { text: string }) {
  const lines = text.split('\n');
  const blocks: ReactNode[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (/^\s*[-*]\s+/.test(line)) {
      const bulletItems: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        bulletItems.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i += 1;
      }
      i -= 1;

      blocks.push(
        <ul key={`ul-${i}`} className="list-disc pl-6 space-y-2">
          {bulletItems.map((item, index) => (
            <li key={`li-${i}-${index}`}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (line.trim() === '') {
      blocks.push(<div key={`spacer-${i}`} className="h-4" />);
      continue;
    }

    blocks.push(
      <p key={`p-${i}`} className="leading-relaxed">
        {renderInline(line)}
      </p>
    );
  }

  return <div className="space-y-2">{blocks}</div>;
}
