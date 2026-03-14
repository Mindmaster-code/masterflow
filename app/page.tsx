import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, Target, Brain, BarChart3, Rocket,
  CheckCircle2, Sparkles, ChevronRight, Zap,
  Users, TrendingUp, Award, Shield
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ background: '#060d18' }}>

      {/* ─── Nav ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 nav-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group text-white">
            <Image src="/mindmaster-logo.svg" alt="MindMaster" width={140} height={36} className="h-9 w-auto" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {['Como Funciona', 'Metodologia', 'Recursos'].map((item) => (
              <span key={item} className="px-4 py-2 text-sm text-white/50 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer transition-all">
                {item}
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-sm text-white/60 hover:text-white hover:bg-white/5">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button className="premium-button text-sm px-5 h-9 rounded-xl">
                Começar Agora
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16">
        <div className="hero-bg" />
        <div className="orb orb-teal w-[600px] h-[600px] top-[-100px] left-[-150px] animate-float" />
        <div className="orb orb-cyan w-[500px] h-[500px] bottom-[-50px] right-[-100px] animate-float-delayed" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-10">
            <Image src="/mindmaster-logo.svg" alt="MindMaster" width={180} height={45} className="h-12 w-auto" priority />
          </div>

          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="pill-badge">
              <Sparkles className="w-3.5 h-3.5" />
              Mentoria de Carreira Executiva
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6 animate-slide-in-up text-balance" style={{ animationDelay: '0.1s' }}>
            Transforme sua{' '}
            <span className="brand-gradient-text">Carreira</span>
            <br />com Gestão Ágil
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            Plataforma de desenvolvimento profissional baseada em Análise SWOT
            e gestão ágil — do diagnóstico ao plano de ação em 4 etapas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <Link href="/register">
              <Button size="lg" className="premium-button text-base px-8 h-13 rounded-2xl group w-full sm:w-auto">
                Iniciar Jornada Gratuita
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="outline-button text-base px-8 h-13 rounded-2xl w-full sm:w-auto">
                Já sou Aluno
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: CheckCircle2, text: 'Análise SWOT' },
              { icon: CheckCircle2, text: 'Kanban' },
              { icon: CheckCircle2, text: '16 Skills Mapeadas' },
              { icon: CheckCircle2, text: 'Plano de Ação' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-white/40">
                <Icon className="w-4 h-4 text-teal-400" />
                {text}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 text-xs animate-float">
          <span>Role para baixo</span>
          <div className="w-px h-8 gradient-line-vertical" />
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="relative py-6">
        <div className="gradient-line" />
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { value: '4',    label: 'Etapas Estruturadas',      color: 'text-teal-400'    },
              { value: '16',   label: 'Skills Avaliadas',          color: 'text-cyan-400'    },
              { value: '100%', label: 'Baseado em Gestão Ágil',   color: 'text-sky-400'     },
              { value: '360°', label: 'Visão da Carreira',         color: 'text-emerald-400' },
            ].map((stat) => (
              <div key={stat.label} className="stat-card text-center">
                <p className={`text-4xl md:text-5xl font-bold ${stat.color} mb-1.5`}>{stat.value}</p>
                <p className="text-sm text-white/40 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="gradient-line" />
      </section>

      {/* ─── How it Works ─── */}
      <section className="py-24 relative">
        <div className="orb orb-teal w-[400px] h-[400px] top-1/4 right-[-100px] opacity-40" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-label justify-center mb-4">
              <Zap className="w-3.5 h-3.5" />
              Como Funciona
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Sua jornada em{' '}
              <span className="brand-gradient-text">4 etapas</span>
            </h2>
            <p className="text-white/45 text-lg max-w-xl mx-auto">
              Um processo estruturado para mapear onde você está e chegar onde quer ir.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { step: '01', title: 'Ponto de Partida',   desc: 'Mapeie seu perfil profissional atual, qualificações e principais desafios.',               icon: Target,   color: 'from-teal-500 to-cyan-500',  glow: 'rgba(20,184,166,0.3)' },
              { step: '02', title: 'Auto-Conhecimento',  desc: 'Defina suas metas de carreira e as qualificações que você precisa desenvolver.',            icon: Brain,    color: 'from-cyan-500 to-sky-500',   glow: 'rgba(6,182,212,0.3)'  },
              { step: '03', title: 'Mapeamento',         desc: '16 skills avaliadas com análise SWOT completa das suas forças e oportunidades.',             icon: BarChart3, color: 'from-sky-500 to-blue-500',   glow: 'rgba(14,165,233,0.3)' },
              { step: '04', title: 'Plano de Ação',      desc: 'Kanban com ações prioritárias sugeridas e métricas para acompanhar sua evolução.',           icon: Rocket,   color: 'from-teal-600 to-emerald-500', glow: 'rgba(13,148,136,0.3)' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="feature-card p-6 group" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-bold tracking-widest text-white/20">{item.step}</span>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      style={{ boxShadow: `0 8px 20px ${item.glow}` }}>
                      <Icon className="w-5.5 h-5.5 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-base mb-2 text-white/90">{item.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                  <div className={`mt-5 h-px bg-gradient-to-r ${item.color} opacity-25 group-hover:opacity-60 transition-opacity`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-24 relative">
        <div className="gradient-line mb-0" />
        <div className="orb orb-cyan w-[400px] h-[400px] bottom-0 left-[-100px] opacity-35" />
        <div className="max-w-6xl mx-auto px-6 pt-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label mb-4">
                <Award className="w-3.5 h-3.5" />
                Por que o MasterFlow
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Desenvolvimento executivo{' '}
                <span className="brand-gradient-text">baseado em dados</span>
              </h2>
              <p className="text-white/45 text-lg mb-10 leading-relaxed">
                Chega de achismos. O MasterFlow usa metodologias comprovadas como SWOT e Kanban para criar um plano de carreira personalizado e mensurável.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Target,    title: 'Diagnóstico Preciso',  desc: 'Análise de 16 competências com benchmark do mercado' },
                  { icon: TrendingUp, title: 'Evolução Contínua',   desc: 'Acompanhe seu progresso com métricas e indicadores visuais' },
                  { icon: Zap,       title: 'Ações Priorizadas',    desc: 'Kanban com sugestões de ações ordenadas por impacto' },
                  { icon: Shield,    title: 'Metodologia Validada', desc: 'Criado por especialistas da MindMaster com 19.000+ gestores formados' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/2 transition-colors">
                    <div className="w-9 h-9 rounded-lg brand-gradient flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg" style={{ boxShadow: '0 4px 12px rgba(13,148,136,0.25)' }}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white/90 mb-0.5">{title}</h4>
                      <p className="text-sm text-white/40">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup Card */}
            <div className="relative">
              <div className="absolute inset-[-1.5rem] rounded-3xl border border-teal-500/8 animate-spin-slow" />
              <div className="feature-card p-7 relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-white/35 uppercase tracking-wider mb-1">Progresso da Jornada</p>
                    <p className="text-3xl font-bold brand-gradient-text">75%</p>
                  </div>
                  <div className="w-13 h-13 rounded-2xl brand-gradient flex items-center justify-center shadow-xl" style={{ boxShadow: '0 8px 24px rgba(13,148,136,0.3)' }}>
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full w-3/4 progress-bar-teal rounded-full" />
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Ponto de Partida',    done: true,  step: '01' },
                    { label: 'Auto-Conhecimento',   done: true,  step: '02' },
                    { label: 'Mapeamento SWOT',     done: true,  step: '03' },
                    { label: 'Plano de Ação',        done: false, step: '04' },
                  ].map(s => (
                    <div key={s.step} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${s.done ? 'brand-gradient text-white' : 'text-white/25'}`}
                        style={s.done ? { boxShadow: '0 3px 8px rgba(13,148,136,0.25)' } : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        {s.done ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                      </div>
                      <span className={`text-sm font-medium ${s.done ? 'text-white/75' : 'text-white/25'}`}>{s.label}</span>
                      {s.done && <CheckCircle2 className="w-4 h-4 text-teal-400 ml-auto" />}
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(13,148,136,0.12)' }}>
                  <span className="text-xs text-white/30">Próxima etapa</span>
                  <span className="text-sm font-semibold text-teal-400 flex items-center gap-1">Plano de Ação <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Methodologies ─── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="section-label justify-center mb-4">
            <Users className="w-3.5 h-3.5" />
            Metodologias
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">
            Baseado nas melhores{' '}
            <span className="brand-gradient-text">práticas do mercado</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'Análise SWOT',    color: 'from-teal-600 to-teal-700'   },
              { name: 'Kanban',          color: 'from-cyan-600 to-sky-600'    },
              { name: 'Scrum',           color: 'from-sky-600 to-blue-600'    },
              { name: 'Design Thinking', color: 'from-blue-600 to-indigo-600' },
              { name: 'Lean',            color: 'from-teal-700 to-emerald-700'},
            ].map(m => (
              <div key={m.name} className={`px-5 py-2.5 rounded-xl bg-gradient-to-br ${m.color} text-white text-sm font-semibold shadow-lg hover:scale-105 transition-transform cursor-default`}>
                {m.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 relative">
        <div className="gradient-line mb-0" />
        <div className="orb orb-teal w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="pill-badge justify-center mb-6 mx-auto w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            Comece hoje mesmo
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Pronto para o{' '}
            <span className="brand-gradient-text">próximo nível</span>?
          </h2>
          <p className="text-white/45 text-lg mb-10 leading-relaxed">
            Junte-se a executivos que usam o MasterFlow para acelerar sua carreira com clareza e método.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="premium-button text-base px-10 h-13 rounded-2xl group w-full sm:w-auto">
                Começar Agora — É Grátis
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="outline-button text-base px-10 h-13 rounded-2xl w-full sm:w-auto">
                Já tenho uma conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t" style={{ borderColor: 'rgba(13,148,136,0.1)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg brand-gradient flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white/75">MasterFlow</span>
            <span className="text-white/25 text-sm">by MindMaster</span>
          </div>
          <p className="text-white/25 text-sm">© {new Date().getFullYear()} MindMaster. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
