'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Linkedin, Loader2, Sparkles, CheckCircle2, AlertCircle, Target, Lightbulb } from 'lucide-react';

interface AnalysisResult {
  pontosFortes: string[];
  pontosMelhoria: string[];
  recomendacoes: { titulo: string; descricao: string; prioridade: string }[];
  resumo: string;
}

export default function LinkedinPage() {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [profileContent, setProfileContent] = useState('');
  const [cargo, setCargo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/linkedin/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedinUrl: linkedinUrl || undefined,
          profileContent: profileContent || undefined,
          cargo: cargo || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao analisar');
        if (data.needsFallback) setShowFallback(true);
        return;
      }

      setResult(data);
      setShowFallback(false);
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="text-white/60 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #0A66C2, #004182)',
            boxShadow: '0 8px 24px rgba(10,102,194,0.35)',
          }}
        >
          <Linkedin className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Avaliar meu LinkedIn</h1>
          <p className="text-white/50 text-sm">
            Análise do seu perfil com recomendações para atrair recrutadores
          </p>
        </div>
      </div>

      <Card className="premium-card border-teal-500/20 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            Análise do Perfil
          </CardTitle>
          <CardDescription>
            O LinkedIn bloqueia acesso automático. A forma mais confiável é colar o conteúdo do seu perfil abaixo. Abra seu perfil no LinkedIn, selecione e copie o texto (About, Experiência, Skills) e cole aqui.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-white/70">Conteúdo do seu perfil LinkedIn *</Label>
              <p className="text-xs text-white/40 mt-1 mb-2">
                Abra seu perfil no LinkedIn, selecione todo o texto (About, Experiência, Skills) e cole aqui
              </p>
              <textarea
                value={profileContent}
                onChange={(e) => setProfileContent(e.target.value)}
                placeholder="Cole aqui: About, Experiência, Skills, Formação..."
                rows={8}
                className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white placeholder:text-white/30 text-sm resize-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30"
              />
            </div>

            <div>
              <Label className="text-white/50 text-sm">
                Ou tente o link (pode não funcionar)
              </Label>
              <Input
                type="url"
                placeholder="https://linkedin.com/in/seu-usuario"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            {showFallback && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-200/90">
                  O link não funcionou (LinkedIn bloqueia acesso automático). Use o campo acima para colar o conteúdo do seu perfil e clique em Analisar.
                </p>
              </div>
            )}

            <div>
              <Label className="text-white/50 text-sm">
                Cargo desejado (opcional)
              </Label>
              <Input
                type="text"
                placeholder="Ex: Diretor de TI, Product Manager"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || (!linkedinUrl && !profileContent)}
              className="premium-button w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analisar Perfil
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6 animate-fade-in">
          <Card className="premium-card border-teal-500/20">
            <CardHeader>
              <CardTitle className="text-lg">Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 leading-relaxed">{result.resumo}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="premium-card border-green-500/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Pontos Fortes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.pontosFortes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="premium-card border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-amber-400">
                  <Target className="w-4 h-4" />
                  Pontos de Melhoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.pontosMelhoria.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="premium-card border-teal-500/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-teal-400" />
                Plano de Ação
              </CardTitle>
              <CardDescription>Recomendações priorizadas para melhorar seu perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.recomendacoes.map((rec, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">{rec.titulo}</h4>
                      <Badge
                        className={`text-xs ${
                          rec.prioridade === 'alta'
                            ? 'bg-red-500/20 border-red-500/40 text-red-300'
                            : rec.prioridade === 'media'
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                        }`}
                      >
                        {rec.prioridade}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60">{rec.descricao}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
