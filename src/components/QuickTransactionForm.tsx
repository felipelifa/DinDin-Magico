import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, TrendingUp, TrendingDown, Mic, MicOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDateContext } from "@/contexts/DateContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  amount: number;
  description: string;
  category: string;
}

const QuickTransactionForm = () => {
  const [expenseData, setExpenseData] = useState<Transaction>({
    amount: 0,
    description: "",
    category: ""
  });
  
  const [incomeData, setIncomeData] = useState<Transaction>({
    amount: 0,
    description: "",
    category: ""
  });

  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const recognition = useRef<any>(null);
  const { user } = useAuth();
  const { triggerRefresh } = useDateContext();
  const { toast } = useToast();

  // Inicializar reconhecimento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'pt-BR';

      recognition.current.onresult = (event: any) => {
        console.log('🎤 Resultado do reconhecimento:', event.results);
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('🎤 Transcrição recebida:', transcript);
        processVoiceInput(transcript);
      };

      recognition.current.onerror = (event: any) => {
        console.error('❌ Erro no reconhecimento de voz:', event.error);
        setIsListening(false);
        
        // Só mostrar toast se não for um erro de rede (que pode ser temporário)
        if (event.error !== 'network') {
          toast({
            title: "Erro no reconhecimento de voz",
            description: "Tente novamente",
            variant: "destructive",
          });
        }
      };

      recognition.current.onend = () => {
        console.log('🔚 Reconhecimento de voz finalizado');
        setIsListening(false);
      };
    }
  }, []);

  const processVoiceInput = (transcript: string) => {
    console.log('🔄 Processando entrada de voz:', transcript);
    console.log('🔄 Tab ativa:', activeTab);
    
    // Extrair informações da fala
    const words = transcript.split(' ');
    let amount = 0;
    let description = '';
    let category = '';

    // Procurar por valores monetários
    const valueMatches = transcript.match(/(\d+(?:[.,]\d+)?)\s*(?:reais?|real|r\$)?/i);
    if (valueMatches) {
      amount = parseFloat(valueMatches[1].replace(',', '.'));
      console.log('💰 Valor encontrado:', amount);
    } else {
      console.log('❌ Nenhum valor encontrado na transcrição');
    }

    // Identificar categorias baseadas em palavras-chave
    const categoryKeywords: Record<string, string[]> = {
      // Categorias de gastos
      'Alimentação': ['comida', 'almoço', 'jantar', 'café', 'lanche', 'restaurante', 'mercado', 'supermercado'],
      'Transporte': ['uber', 'taxi', 'ônibus', 'gasolina', 'combustível', 'estacionamento'],
      'Lazer': ['cinema', 'teatro', 'festa', 'bar', 'diversão', 'entretenimento'],
      'Saúde': ['médico', 'farmácia', 'remédio', 'consulta', 'exame'],
      'Casa': ['aluguel', 'luz', 'água', 'internet', 'condomínio'],
      'Compras': ['roupa', 'shopping', 'compra', 'produto'],
      // Categorias de entrada
      'salary': ['salário', 'trabalho', 'pagamento', 'salario'],
      'freelance': ['freelance', 'freela', 'projeto', 'bico'],
      'sales': ['venda', 'vendeu', 'vendido'],
      'investment': ['investimento', 'rendimento', 'aplicação'],
      'gift': ['presente', 'prêmio', 'bonus', 'bônus'],
      'cashback': ['cashback', 'desconto', 'volta'],
      'other': ['outros', 'outro', 'entrada']
    };

    // MUDANÇA IMPORTANTE: Detectar tipo baseado na aba ativa E palavras-chave
    let detectedType = activeTab;
    
    // Se estiver na aba de entrada, verificar se há indicadores de gasto
    if (activeTab === 'income') {
      // Palavras que indicam claramente gasto
      const expenseIndicators = ['gasto', 'gastei', 'comprei', 'paguei', 'conta', 'compra'];
      const hasExpenseIndicator = expenseIndicators.some(indicator => transcript.includes(indicator));
      
      if (hasExpenseIndicator) {
        detectedType = 'expense';
        console.log('🔄 Detectado gasto na aba de entrada - mudando para gasto');
      } else {
        // Se está na aba entrada e não tem indicador de gasto, manter como entrada
        detectedType = 'income';
        console.log('🔄 Mantendo como entrada (aba ativa)');
      }
    }
    
    // Se estiver na aba de gasto, verificar se há indicadores de entrada
    if (activeTab === 'expense') {
      // Palavras que indicam claramente entrada
      const incomeIndicators = ['recebi', 'entrada', 'salário', 'salario', 'ganho', 'recebimento', 'rendimento'];
      const hasIncomeIndicator = incomeIndicators.some(indicator => transcript.includes(indicator));
      
      if (hasIncomeIndicator) {
        detectedType = 'income';
        console.log('🔄 Detectada entrada na aba de gasto - mudando para entrada');
      } else {
        // Se está na aba gasto e não tem indicador de entrada, manter como gasto
        detectedType = 'expense';
        console.log('🔄 Mantendo como gasto (aba ativa)');
      }
    }
    
    // Verificar categorias específicas baseadas em palavras-chave
    const incomeKeywords = ['salary', 'freelance', 'sales', 'investment', 'gift', 'cashback'];
    for (const cat of incomeKeywords) {
      if (categoryKeywords[cat]?.some(keyword => transcript.includes(keyword))) {
        detectedType = 'income';
        category = cat;
        console.log('🔄 Detectada entrada por categoria:', cat);
        break;
      }
    }
    
    // Se não foi detectada entrada, verificar gastos
    if (detectedType === 'expense' && !category) {
      const expenseKeywords = ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Casa', 'Compras'];
      for (const cat of expenseKeywords) {
        if (categoryKeywords[cat]?.some(keyword => transcript.includes(keyword))) {
          category = cat;
          break;
        }
      }
      if (!category) category = 'Outros';
    }

    // Se não encontrou categoria para entrada, usar 'other'
    if (detectedType === 'income' && !category) {
      category = 'other';
    }

    // Gerar descrição baseada na transcrição
    description = transcript.charAt(0).toUpperCase() + transcript.slice(1);

    console.log('📋 Dados processados:', { amount, description, category, detectedType, activeTab });

    // MUDANÇA IMPORTANTE: Trocar para a aba correta se necessário
    if (detectedType !== activeTab) {
      console.log('🔄 Mudando aba de', activeTab, 'para', detectedType);
      setActiveTab(detectedType);
    }

    // Atualizar os dados do formulário
    if (detectedType === 'expense') {
      console.log('💸 Atualizando dados de gasto');
      setExpenseData(prev => {
        const newData = {
          amount: amount > 0 ? amount : prev.amount,
          description: description || prev.description,
          category: category || prev.category
        };
        console.log('💸 Novos dados de gasto:', newData);
        return newData;
      });
    } else {
      console.log('💰 Atualizando dados de entrada');
      setIncomeData(prev => {
        const newData = {
          amount: amount > 0 ? amount : prev.amount,
          description: description || prev.description,
          category: category || prev.category
        };
        console.log('💰 Novos dados de entrada:', newData);
        return newData;
      });
    }

    toast({
      title: "Comando de voz processado! 🎤",
      description: `Detectado: R$ ${amount.toFixed(2)} - ${description} (${category}) - ${detectedType === 'income' ? 'Entrada' : 'Gasto'}`,
    });
  };

  const startVoiceRecognition = async () => {
    if (!recognition.current) {
      toast({
        title: "Reconhecimento de voz não suportado",
        description: "Seu navegador não suporta esta funcionalidade",
        variant: "destructive",
      });
      return;
    }

    // Se já está escutando, parar primeiro
    if (isListening) {
      stopVoiceRecognition();
      return;
    }

    try {
      // Verificar se já tem permissão do microfone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Parar o stream imediatamente, só queríamos verificar a permissão
      stream.getTracks().forEach(track => track.stop());
      
      // Garantir que está parado antes de iniciar
      if (recognition.current.readyState === 1) { // Se está rodando
        recognition.current.stop();
        await new Promise(resolve => setTimeout(resolve, 100)); // Pequena pausa
      }
      
      setIsListening(true);
      console.log('🎤 Iniciando reconhecimento de voz...');
      recognition.current.start();
      
      toast({
        title: "Escutando... 🎤",
        description: `Diga algo como: "Gasto de 25 reais no almoço" ou "Entrada de 1000 reais do salário"`,
      });
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      setIsListening(false);
      
      let errorMessage = "Permita o acesso ao microfone para usar esta funcionalidade";
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = "Acesso ao microfone foi negado. Clique no ícone do microfone na barra de endereços e permita o acesso.";
        } else if (error.name === 'NotFoundError') {
          errorMessage = "Nenhum microfone foi encontrado no seu dispositivo.";
        } else if (error.name === 'NotSupportedError') {
          errorMessage = "Seu navegador não suporta reconhecimento de voz.";
        } else if (error.name === 'InvalidStateError') {
          errorMessage = "O reconhecimento de voz já está ativo. Aguarde um momento e tente novamente.";
        }
      }
      
      toast({
        title: "Erro ao acessar microfone",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecognition = () => {
    if (recognition.current && isListening) {
      console.log('🛑 Parando reconhecimento de voz...');
      recognition.current.stop();
    }
    setIsListening(false);
  };

  const expenseCategories = [
    'Alimentação', 'Transporte', 'Lazer', 'Saúde', 
    'Casa', 'Compras', 'Educação', 'Outros'
  ];

  const incomeCategories = [
    'salary', 'freelance', 'sales', 'investment',
    'gift', 'cashback', 'other'
  ];

  const getCategoryEmoji = (category: string, type: 'expense' | 'income') => {
    if (type === 'expense') {
      const emojis: Record<string, string> = {
        'Alimentação': '🍽️',
        'Transporte': '🚗',
        'Lazer': '🎬',
        'Saúde': '💊',
        'Casa': '🏠',
        'Compras': '🛍️',
        'Educação': '📚',
        'Outros': '💸'
      };
      return emojis[category] || emojis['Outros'];
    } else {
      const emojis: Record<string, string> = {
        'salary': '💼',
        'freelance': '💻',
        'sales': '💰',
        'investment': '📈',
        'gift': '🎁',
        'cashback': '💳',
        'other': '💰'
      };
      return emojis[category] || emojis['Outros'];
    }
  };

  const addExpense = async () => {
    if (!user || !expenseData.amount || !expenseData.description || !expenseData.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para adicionar o gasto",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const expenseEntry = {
        user_id: user.id,
        amount: expenseData.amount,
        description: expenseData.description,
        category: expenseData.category,
        emoji: getCategoryEmoji(expenseData.category, 'expense'),
        date: new Date().toISOString().split('T')[0],
        expense_type: 'normal'
      };

      const { error } = await supabase
        .from('expenses')
        .insert([expenseEntry]);

      if (error) throw error;

      setExpenseData({ amount: 0, description: "", category: "" });
      triggerRefresh();

      toast({
        title: "Gasto adicionado! 💸",
        description: `R$ ${expenseData.amount.toFixed(2)} em ${expenseData.category}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar gasto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addIncome = async () => {
    if (!user || !incomeData.amount || !incomeData.description || !incomeData.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para adicionar a entrada",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const incomeEntry = {
        user_id: user.id,
        amount: incomeData.amount,
        name: incomeData.description,
        source_type: incomeData.category,
        emoji: getCategoryEmoji(incomeData.category, 'income'),
        receive_date: new Date().toISOString().split('T')[0],
        is_recurring: false
      };

      const { error } = await supabase
        .from('income_entries')
        .insert([incomeEntry]);

      if (error) throw error;

      setIncomeData({ amount: 0, description: "", category: "" });
      triggerRefresh();

      toast({
        title: "Entrada adicionada! 💰",
        description: `R$ ${incomeData.amount.toFixed(2)} de ${incomeData.category}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar entrada",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader className="px-3 md:px-6 pt-3 md:pt-6 pb-3 md:pb-6">
        <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
          <Plus className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          <span>Adicionar Movimentação</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
        <Tabs defaultValue="expense" className="w-full" onValueChange={(value) => setActiveTab(value as "expense" | "income")}>
          <TabsList className="grid w-full grid-cols-2 h-10 md:h-11">
            <TabsTrigger 
              value="expense" 
              className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground"
            >
              <TrendingDown className="h-3 w-3 md:h-4 md:w-4" />
              <span>Gasto</span>
            </TabsTrigger>
            <TabsTrigger 
              value="income" 
              className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm data-[state=active]:bg-success data-[state=active]:text-success-foreground"
            >
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
              <span>Entrada</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Botão de Voz */}
          <div className="flex justify-center mt-3 md:mt-4 mb-2">
            <Button
              onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              className="flex items-center space-x-2 text-xs md:text-sm h-8 md:h-9"
            >
              {isListening ? <MicOff className="h-3 w-3 md:h-4 md:w-4" /> : <Mic className="h-3 w-3 md:h-4 md:w-4" />}
              <span className="hidden sm:inline">{isListening ? "Parar de escutar" : "Falar transação"}</span>
              <span className="sm:hidden">{isListening ? "Parar" : "Falar"}</span>
            </Button>
          </div>
          
          <TabsContent value="expense" className="space-y-3 md:space-y-4 mt-3 md:mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="expense-amount" className="text-xs md:text-sm">Valor</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  placeholder="0,00"
                  className="h-9 md:h-10 text-sm"
                  value={expenseData.amount || ""}
                  onChange={(e) => setExpenseData({...expenseData, amount: Number(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expense-category" className="text-xs md:text-sm">Categoria</Label>
                <Select value={expenseData.category} onValueChange={(value) => setExpenseData({...expenseData, category: value})}>
                  <SelectTrigger className="h-9 md:h-10 text-sm">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {getCategoryEmoji(category, 'expense')} {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expense-description" className="text-xs md:text-sm">Descrição</Label>
                <Input
                  id="expense-description"
                  placeholder="Ex: Almoço no restaurante"
                  className="h-9 md:h-10 text-sm"
                  value={expenseData.description}
                  onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={addExpense}
                  disabled={loading}
                  className="w-full h-9 md:h-10 text-xs md:text-sm"
                  variant="destructive"
                >
                  {loading ? "Salvando..." : "Adicionar Gasto"}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="income" className="space-y-3 md:space-y-4 mt-3 md:mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="income-amount" className="text-xs md:text-sm">Valor</Label>
                <Input
                  id="income-amount"
                  type="number"
                  placeholder="0,00"
                  className="h-9 md:h-10 text-sm"
                  value={incomeData.amount || ""}
                  onChange={(e) => setIncomeData({...incomeData, amount: Number(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="income-category" className="text-xs md:text-sm">Categoria</Label>
                <Select value={incomeData.category} onValueChange={(value) => setIncomeData({...incomeData, category: value})}>
                  <SelectTrigger className="h-9 md:h-10 text-sm">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                     {incomeCategories.map((category) => (
                       <SelectItem key={category} value={category}>
                         {getCategoryEmoji(category, 'income')} {
                           category === 'salary' ? 'Salário' :
                           category === 'freelance' ? 'Freelance' :
                           category === 'sales' ? 'Vendas' :
                           category === 'investment' ? 'Investimentos' :
                           category === 'gift' ? 'Presente' :
                           category === 'cashback' ? 'Cashback' :
                           'Outros'
                         }
                       </SelectItem>
                     ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="income-description" className="text-xs md:text-sm">Descrição</Label>
                <Input
                  id="income-description"
                  placeholder="Ex: Salário do mês"
                  className="h-9 md:h-10 text-sm"
                  value={incomeData.description}
                  onChange={(e) => setIncomeData({...incomeData, description: e.target.value})}
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={addIncome}
                  disabled={loading}
                  className="w-full bg-success hover:bg-success/90 text-success-foreground h-9 md:h-10 text-xs md:text-sm"
                >
                  {loading ? "Salvando..." : "Adicionar Entrada"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QuickTransactionForm;