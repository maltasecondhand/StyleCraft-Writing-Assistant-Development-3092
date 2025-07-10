import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestLogin } from '@questlabs/react-sdk';
import questConfig from '../config/questConfig';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3 } = FiIcons;

function Login() {
  const navigate = useNavigate();

  const handleLogin = ({ userId, token, newUser }) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    
    if (newUser) {
      navigate('/onboarding');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left: Branding Section */}
        <div className="p-8 bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <SafeIcon icon={FiEdit3} className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl font-bold">moanote AI</h1>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Welcome to moanote AI
            </h2>
            <p className="text-white/80">
              AIと一緒に心に届くnote記事を作成。自分らしい文体で読者に響く記事を簡単に生成できます。
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">✨ AIによる文章生成</h3>
              <p className="text-sm text-white/70">
                あなたの個性を反映した、機械的でない温かみのある文章を生成
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🎯 読者に届く構成</h3>
              <p className="text-sm text-white/70">
                心理効果を活用した、読者の心に響く記事構成を自動提案
              </p>
            </div>
          </div>
        </div>

        {/* Right: Login Component */}
        <div className="p-8 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ログイン / 新規登録
            </h2>
            <p className="text-gray-600">
              メールアドレスでログインまたは新規登録ができます
            </p>
          </div>

          <QuestLogin
            onSubmit={handleLogin}
            email={true}
            google={false}
            accent={questConfig.PRIMARY_COLOR}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;