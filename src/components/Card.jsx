import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Reusable Card
 *
 * Props:
 *   title        string   – card heading
 *   description  string   – body text
 *   image        string | ReactNode – URL or emoji/icon
 *   tag          string   – badge label
 *   tagColor     'green' | 'amber' | 'blue' | 'red' | 'purple'
 *   actionLabel  string   – CTA text
 *   actionLink   string   – internal <Link to>
 *   actionHref   string   – external <a href>
 *   variant      'default' | 'highlight' | 'minimal'
 */
export default function Card({
  title,
  description,
  image,
  tag,
  tagColor = 'green',
  actionLabel,
  actionLink,
  actionHref,
  variant = 'default',
}) {
  const tagColors = {
    green:  'bg-green-900/40  text-green-400  border-green-700/30',
    amber:  'bg-amber-900/40  text-amber-400  border-amber-700/30',
    blue:   'bg-blue-900/40   text-blue-400   border-blue-700/30',
    red:    'bg-red-900/40    text-red-400    border-red-700/30',
    purple: 'bg-purple-900/40 text-purple-400 border-purple-700/30',
  };

  const variantClass = {
    default:
      'bg-[#111a11] border-green-900/30 hover:border-green-600/40 hover:shadow-lg hover:shadow-green-900/20',
    highlight:
      'bg-gradient-to-br from-green-900/30 to-[#111a11] border-green-600/30 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-800/25',
    minimal:
      'bg-transparent border-green-900/20 hover:border-green-700/30 hover:bg-green-900/10',
  };

  const ActionEl   = actionLink ? Link : actionHref ? 'a' : null;
  const actionProps = actionLink
    ? { to: actionLink }
    : actionHref
    ? { href: actionHref, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <div
      className={[
        'group flex flex-col rounded-2xl border overflow-hidden',
        'transition-all duration-300 hover:-translate-y-1',
        variantClass[variant] ?? variantClass.default,
      ].join(' ')}
    >
      {/* image / icon area */}
      {image && (
        <div className="relative w-full h-40 bg-gradient-to-br from-green-900/20 to-[#0a0f0a] flex items-center justify-center overflow-hidden shrink-0">
          {typeof image === 'string' && image.startsWith('http') ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <span className="text-5xl select-none leading-none">{image}</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111a11]/70 to-transparent" />
        </div>
      )}

      {/* body */}
      <div className="flex flex-col flex-1 gap-3 p-5 items-center text-center">
        {/* tag */}
        {tag && (
          <span className={`self-center text-xs font-semibold px-2.5 py-1 rounded-full border ${tagColors[tagColor] ?? tagColors.green}`}>
            {tag}
          </span>
        )}

        {/* title */}
        <h3 className="text-base font-bold text-white leading-snug group-hover:text-green-300 transition-colors duration-200">
          {title}
        </h3>

        {/* description */}
        {description && (
          <p className="text-sm text-gray-400 leading-relaxed flex-1">{description}</p>
        )}

        {/* action */}
        {ActionEl && actionLabel && (
          <ActionEl
            {...actionProps}
            className="mt-auto self-center inline-flex items-center gap-1.5 text-sm font-semibold text-green-400 hover:text-green-300 transition-colors duration-200 group/link"
          >
            {actionLabel}
            {actionHref
              ? <ExternalLink size={13} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              : <ArrowRight   size={13} className="group-hover/link:translate-x-1 transition-transform" />
            }
          </ActionEl>
        )}
      </div>
    </div>
  );
}
