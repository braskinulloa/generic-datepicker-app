import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import {
	NgbDate,
	NgbDateStruct,
	NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import { NgbTime } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time';
import { subDays } from 'date-fns';
import { format } from 'date-fns';

@Component({
	selector: 'app-sophia-datepicker',
	templateUrl: './sophia-datepicker.component.html',
	styleUrls: ['./sophia-datepicker.component.css']
})
export class SophiaDatepickerComponent implements OnInit, OnChanges {
	@Input() modelButtons: { label: string, value: number, icon?: string }[] | null = null; 
	@Input() submitButton: { label?: string, icon?: string } | null = null;
	@Input() type: 'single' | 'multiple' = 'multiple';
	@Input() startDate: Date | null = null;
	@Input() endDate: Date | null = null;
	@Input() useTime: boolean = false;
	@Input() useSeconds: boolean = true;
	@Input() dateFormat: string | null = null;
	@Input() mobileView: boolean | null = null;

	@Output('timeframe') timeframe: EventEmitter<Array<Date | string> | Date  | string> = new EventEmitter<Array<Date | string> | Date | string>();
	@Output('timeframeISO') timeframeISO: EventEmitter<Array<string> | string> = new EventEmitter<Array<string> | string>();
	@Output('timeframeUTC') timeframeUTC: EventEmitter<Array<string> | string> = new EventEmitter<Array<string> | string>();
	
	isMobile: boolean = false;
	ngbStartTime: NgbTimeStruct | null = null
	ngbEndTime: NgbTimeStruct | null = null
	ngbStartDate: NgbDateStruct | null = null;
	ngbEndDate: NgbDateStruct | null = null;
	timeframeButtonModel: NgModel | number | null = null;
	timeframeSelect: NgModel | number | null = 0;
	readonly minDate = new NgbDate(1999, 1, 1);
	
	
	get today(){
		const now = new Date();
		return new NgbDate(now.getFullYear(), now.getMonth()+1, now.getDate());
	}

	constructor(){
	}
	
	onResize(event: any) {
		if (event.target.innerWidth <= 767) {
			this.isMobile = true;
		} else {
			this.isMobile = false;
		}
	}
	ngOnInit(): void {
		if (this.mobileView!=null) {
			this.isMobile = this.mobileView;
		}
		if (this.ngbEndDate == null) {
			this.ngbEndDate = this.today;
		}
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (this.startDate) {
			this.ngbStartDate = new NgbDate(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate());
			this.ngbStartTime = { hour: this.startDate.getHours(), minute: this.startDate.getMinutes(), second: this.startDate.getSeconds() };
		}
		if (this.endDate) {
			this.ngbEndDate = new NgbDate(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate());
			this.ngbEndTime = { hour: this.endDate.getHours(), minute: this.endDate.getMinutes(), second: this.endDate.getSeconds() };
		}
		this.isMobile = this.mobileView??false;
	}
	onTimeframeChange(){		
		const diff = this.timeframeButtonModel as number;
		if (diff) {
			this.changeRange(diff);
		}
	}
	changeRange(diff: number){
		let diff_date = this.type=='single'&&this.startDate?subDays(new Date(this.startDate.getFullYear(), this.startDate.getMonth() - 1, this.startDate.getDate()), diff):subDays(new Date(this.today.year, this.today.month - 1, this.today.day), diff);
		this.ngbStartDate = new NgbDate(diff_date.getFullYear(), diff_date.getMonth() + 1, diff_date.getDate());
		this.ngbEndDate = this.today;
		console.log(this.ngbStartDate);
		if (!this.submitButton) {
			this.emitDateSelection();
		}
	}
	emitDateSelection(){
		switch (this.type) {
			case 'single':
				this.ngbStartDate = this.ngbStartDate??this.today;	
				this.ngbStartTime = this.ngbStartTime??{ hour: 0, minute: 0, second: 0};
				const date = new Date(this.ngbStartDate?.year, this.ngbStartDate?.month - 1, this.ngbStartDate?.day, this.ngbStartTime?.hour, this.ngbStartTime?.minute, this.ngbStartTime?.second, 0);
				this.timeframe.emit(
					this.format(date, this.dateFormat)
				);				
				this.timeframeISO.emit(new Date(date).toISOString());
				this.timeframeUTC.emit(new Date(date).toUTCString());
				break;
				
			case 'multiple':
				this.ngbStartDate = this.ngbStartDate??this.today;
				this.ngbStartTime = this.ngbStartTime??{ hour: 0, minute: 0, second: 0};
				this.ngbEndDate = this.ngbEndDate??this.today;
				this.ngbEndTime = this.ngbEndTime??{ hour: 23, minute: 59, second: 59};
				const startDate = new Date(this.ngbStartDate?.year, this.ngbStartDate?.month - 1, this.ngbStartDate?.day, this.ngbStartTime?.hour, this.ngbStartTime?.minute, this.ngbStartTime?.second, 0);
				const endDate = 
					new Date(this.ngbEndDate?.year, this.ngbEndDate?.month - 1, this.ngbEndDate?.day, this.ngbEndTime?.hour, this.ngbEndTime?.minute, this.ngbEndTime?.second, 59);
				this.timeframe.emit([
						this.format(startDate, this.dateFormat),
						this.format(endDate, this.dateFormat),
				]);
				this.timeframeISO.emit([
					new Date(startDate).toISOString(),
					new Date(endDate).toISOString()
				]);
				this.timeframeUTC.emit([
					new Date(startDate).toUTCString(),
					new Date(endDate).toUTCString()
				]);
				break;
			default:
				break;
		}
	}
	ngbStartDateChanged(){
		if(!this.submitButton && !this.useTime){
			this.emitDateSelection();
		}
	}
	ngbEndDateChanged(){
		if(!this.submitButton && !this.useTime){
			this.emitDateSelection();
		}
	}
	ngbStartTimeChanged(){
		console.log('start time');
		if(!this.submitButton){
			this.emitDateSelection();
		}
	}
	ngbEndTimeChanged(){
		console.log('end time');
		if(!this.submitButton){
			this.emitDateSelection();
		}
	}
	/**
	 * Formats a date
	 * https://date-fns.org/v2.28.0/docs/format
	 * @param date 
	 * @param dateformat 
	 * @returns 
	 */
	format(date: Date | string, dateformat: string | null): Date | string {
		const to_format_date = typeof date === 'string' ? new Date(date) : date;
		if (dateformat) {
			return format(to_format_date, dateformat);
		}
		return date;
	}
}