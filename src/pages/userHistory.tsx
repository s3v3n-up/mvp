import styles from '../styles/History.module.sass';
import Image from 'next/image';
import Created from '@/components/userMatches';

export default function History() {
    return(
        <div>
            <div>
                <p>Your Matches</p>

            </div>
            <Created/>
        </div>
    )
}