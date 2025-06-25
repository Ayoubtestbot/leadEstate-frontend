import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageToggle from '../components/LanguageToggle'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, user, loading } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && password) {
      login({ email, password })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Language Toggle */}
        <div className="flex justify-end">
          <LanguageToggle />
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {t('login.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('login.emailLabel')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 input"
                placeholder={t('login.emailLabel')}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('login.passwordLabel')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 input"
                placeholder={t('login.passwordLabel')}
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading ? t('common.loading') : t('login.signInButton')}
            </button>
          </div>

          {/* Demo Role Selection */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-3">{t('login.demoAccounts')}:</h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('manager@demo.com')
                  setPassword('demo123')
                }}
                className="w-full text-left px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-200"
              >
                <div className="font-medium text-blue-900">🔧 Manager</div>
                <div className="text-blue-700 text-xs">Full access to all features, automation, analytics</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('super@demo.com')
                  setPassword('demo123')
                }}
                className="w-full text-left px-3 py-2 text-sm bg-green-50 hover:bg-green-100 rounded-md transition-colors border border-green-200"
              >
                <div className="font-medium text-green-900">⭐ Super Agent</div>
                <div className="text-green-700 text-xs">Import leads, assign leads, view analytics</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('agent@demo.com')
                  setPassword('demo123')
                }}
                className="w-full text-left px-3 py-2 text-sm bg-orange-50 hover:bg-orange-100 rounded-md transition-colors border border-orange-200"
              >
                <div className="font-medium text-orange-900">👤 Agent</div>
                <div className="text-orange-700 text-xs">View assigned leads and properties only</div>
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              Click any role above to auto-fill login credentials
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
