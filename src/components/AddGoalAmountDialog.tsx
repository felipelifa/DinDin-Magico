import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PiggyBank, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddGoalAmountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  goal: {
    id: string;
    name: string;
    emoji: string;
    current_amount: number;
    target_amount: number;
  };
  onAmountAdded: () => void;
}

const AddGoalAmountDialog = ({ isOpen, onClose, goal, onAmountAdded }: AddGoalAmountDialogProps) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddAmount = async () => {
    if (!amount || Number(amount) <= 0) return;

    setIsLoading(true);
    try {
      const newCurrentAmount = goal.current_amount + Number(amount);
      
      const { error } = await supabase
        .from('goals')
        .update({ current_amount: newCurrentAmount })
        .eq('id', goal.id);

      if (error) throw error;

      toast({
        title: "Dinheiro adicionado! 💰",
        description: `R$ ${Number(amount).toFixed(2)} foi adicionado à meta ${goal.name}`,
      });

      setAmount("");
      onAmountAdded();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar valor",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <PiggyBank className="h-5 w-5 text-primary" />
            <span>Adicionar à Meta</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Meta info */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">{goal.emoji}</span>
              <h3 className="font-semibold">{goal.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Atual: R$ {goal.current_amount.toFixed(2)} / R$ {goal.target_amount.toFixed(2)}
            </p>
          </div>

          {/* Amount input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Quanto você guardou? (R$)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50.00"
              min="0.01"
              step="0.01"
              autoFocus
            />
          </div>

          {/* Preview */}
          {amount && Number(amount) > 0 && (
            <div className="p-3 bg-success/10 rounded-lg border border-success/20">
              <p className="text-sm text-success-foreground">
                Novo total: R$ {(goal.current_amount + Number(amount)).toFixed(2)}
              </p>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddAmount}
              disabled={isLoading || !amount || Number(amount) <= 0}
              className="flex-1 bg-gradient-success hover:opacity-90"
            >
              {isLoading ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalAmountDialog;