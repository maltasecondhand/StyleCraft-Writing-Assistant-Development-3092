import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnBoarding } from '@questlabs/react-sdk';
import questConfig from '../config/questConfig';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3 } = FiIcons;

function Onboarding() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const getAnswers = () => {
    navigate('/');
  };

  if (!userId || !token) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left: Visual Section */}
        <div className="p-8 bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <SafeIcon icon={FiEdit3} className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl font-bold">moanote AI</h1>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              初期設定をしましょう
            </h2>
            <p className="text-white/80">
              あなたに最適な記事生成環境を整えるため、いくつかの質問にお答えください。
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🎨 パーソナライズ</h3>
              <p className="text-sm text-white/70">
                あなたの好みや目的に合わせて、AIの設定を最適化します
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">⚡ すぐに始められます</h3>
              <p className="text-sm text-white/70">
                設定完了後、すぐに記事生成を始めることができます
              </p>
            </div>
          </div>
        </div>

        {/* Right: Onboarding Component */}
        <div className="p-8">
          <OnBoarding
            userId={userId}
            token={token}
            questId={questConfig.QUEST_ONBOARDING_QUESTID}
            answer={answers}
            setAnswer={setAnswers}
            getAnswers={getAnswers}
            accent={questConfig.PRIMARY_COLOR}
            singleChoose="modal1"
            multiChoice="modal2"
          >
            <OnBoarding.Header />
            <OnBoarding.Content />
            <OnBoarding.Footer />
          </OnBoarding>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;