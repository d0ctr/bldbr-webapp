import Header from '@/components/Header';
import { permanentRedirect } from 'next/navigation';

export default function Home() {
    return permanentRedirect('/game');
}
