import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui';
import { useT } from '../i18n';

// TODO: full contact / legal / support screens (in progress on feat/mvp-check)
export function Contact() {
  const t = useT();
  const [sent, setSent] = useState(false);
  return (
    <div className="max-w-[560px] mx-auto px-5 py-16">
      <h1 className="text-h-l">{t('contact.title').replace(/\*/g, '')}</h1>
      <p className="mt-2 text-muted">{t('contact.sub')}</p>
      {sent ? <p className="mt-6 text-green" role="status">{t('contact.sent')}</p> : <Button className="mt-6" onClick={() => setSent(true)}>{t('contact.send')}</Button>}
      <Link to="/" className="mt-6 block text-green underline">Hakbang</Link>
    </div>
  );
}
export function Legal() {
  const { doc } = useParams();
  return <div className="max-w-[720px] mx-auto px-5 py-16"><h1 className="text-h-l">{doc === 'terms' ? 'Terms of Use' : 'Privacy Notice'}</h1><p className="mt-3 text-muted">Demo document. Final copy from the team.</p></div>;
}
export function Support() {
  const t = useT();
  return <div className="px-5 py-10"><h1 className="text-h-l">{t('support.title')}</h1><p className="mt-3">{t('support.hi')}</p></div>;
}
