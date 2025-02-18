import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReturnTenderItem, CreateTenderProposalItem, CreateTenderProposal } from '../../_models/tender.types';
import { TenderService } from '../../_services/tender.service';
import { CommonModule } from '@angular/common';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';

@Component({
  selector: 'app-create-tender-proposal',
  imports: [ReactiveFormsModule, CommonModule, MedicineNamePipe],
  templateUrl: './create-tender-proposal.component.html',
  styleUrl: './create-tender-proposal.component.css'
})
export class CreateTenderProposalComponent {
  @Input() tenderId!: number;
  @Input() tenderItems!: ReturnTenderItem[];
  @Output() onClose = new EventEmitter<void>();

  proposalForm: FormGroup;
  totalPrice: number = 0;

  get proposalItemsControls() {
    return (this.proposalForm.get('proposalItems') as FormArray).controls;
  }

  constructor(
    private fb: FormBuilder,
    private tenderService: TenderService
  ) {
    this.proposalForm = this.fb.group({
      proposalItems: this.fb.array([])
    });
  }

  ngOnInit() {
    const proposalItemsArray = this.proposalForm.get('proposalItems') as FormArray;
    
    this.tenderItems.forEach(item => {
      proposalItemsArray.push(this.fb.group({
        medicineId: [item.medicine.id],
        unitPrice: [0, [Validators.required, Validators.min(0.01)]],
        quantity: [item.requiredQuantity, [
          Validators.required,
          Validators.min(1),
          Validators.max(item.requiredQuantity)
        ]]
      }));
    });
  }

  isFieldInvalid(control: any, field: string): boolean {
    return control.get(field).invalid && control.get(field).touched;
  }

  calculateItemTotal(item: any): number {
    return item.unitPrice * item.quantity;
  }

  calculateTotalPrice() {
    this.totalPrice = this.proposalItemsControls.reduce((sum, control) => {
      const item = control.value;
      return sum + (item.unitPrice * item.quantity);
    }, 0);
  }

  submitProposal() {
    if (this.proposalForm.valid) {
      const proposal: CreateTenderProposal = {
        totalPrice: this.totalPrice,
        proposalItemsDTOs: this.proposalForm.value.proposalItems
      };

      this.tenderService.submitProposal(this.tenderId, proposal)
        .subscribe({
          next: (response) => {
            this.close();
          },
          error: (error) => console.error('Error submitting proposal:', error)
        });
    } else {
      this.proposalForm.markAllAsTouched();
    }
  }

  close() {
    this.onClose.emit();
  }
}
