import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

import Image from 'next/image'
import appPreviewImg from '../assets/twoPhones.png' //appBg.png
import logoImg from '../assets/logo.svg'
import avatares from '../assets/avatares.png'
import inconCheckImg from '../assets/icon_check.svg'

interface HomeProps {
  poolCount: number;
  guessCount: number;
  usersCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent){
    event.preventDefault;

    try{
      const response = await api.post('/pools', {
        title: poolTitle
      });

      const { code } = response.data

      //alert('Bolão criado, Código: ' + code + '\n Note que com chrome e firerox não funciona, recomendo o Opera')
      
      await navigator.clipboard.writeText(code);
      alert('Bolão criado com sucesso e código copiado para área de transferencia! Código: ' + code)
      setPoolTitle('')

    } catch (err){
      console.log(err)
      alert('Falha ao criar o bolão, erro: ' + err)
    }
  }
  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="Logo Nlw Copa"/>
        <h1 className="nt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        
        <div className="mt-10 flex itens-center gap-2">
          <Image src={avatares} alt=""/>
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usersCount}</span> pessoas já estão usando
          </strong>
          </div>

          <form onSubmit={createPool} className="mt-10 flex gap-2">
            <input 
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text" 
            required 
            placeholder="Qual nome do seu bolão?"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
            <button 
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
            >Criar meu bolão</button>
          </form>

          <p className="mt-4 text-sm text-gray-300 leading-relaxed">
            Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
          </p>

          <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
            <div className="flex items-center gap-6">
              <Image src={inconCheckImg} alt="" />
              <div className="flex flex-col">
                <span className="font-bold text-2xl">+{props.poolCount}</span>
                <span>Bolões criados</span>
              </div>
            </div>

            <div className="w-px h-14 bg-gray-600"></div>

            <div className="flex items-center gap-6">
              <Image src={inconCheckImg} alt="" />
              <div className="flex flex-col">
                <span className="font-bold text-2xl">+{props.guessCount}</span>
                <span>Palpites enviados</span>
              </div>
            </div>
          </div>
      </main>

      <Image src={appPreviewImg} 
      alt="Dois celulares exibindo uma prévia da aplicação NLW Copa" 
      quality={100}
      />
    </div>
  )
}

export async function getStaticProps() {
  const [poolCountResponse,
    guessCountResponse,
    usersCountResponse
    ] = await Promise.all([
    api.get('/pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.pools,
      guessCount: guessCountResponse.data.guesses,
      usersCount: usersCountResponse.data.users
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
     revalidate: 60, // In seconds
  }
}

// export const getServerSideProps = async () => {
// }

// uma forma de buscar porém se o navegador estiver com o JS bloqueado não irá funcionar
// fetch('http://localhost:3333/pools/count')
// .then(response => response.json())
// .then(data => {
//   console.log(data.count)
// })
  