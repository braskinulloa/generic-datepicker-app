import { Component, EventEmitter, Injectable, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgModel } from '@angular/forms';
import {
	NgbDate,
	NgbDateAdapter,
	NgbDateParserFormatter,
	NgbDateStruct,
	NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import { subDays } from 'date-fns';
import { format as fnsFormat} from 'date-fns';
 
let INPUT_FORMAT = '/'

 /**
  * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
  */
 @Injectable()
 export class CustomDateParserFormatter extends NgbDateParserFormatter {

	parse(value: string): NgbDateStruct | null {
		let delimitter = '-';
		let date = [];
		if (!value) {
			return null
		}
		switch (INPUT_FORMAT) {
			case 'mm-dd-yyyy':
				delimitter = '-';
				date = value.split(delimitter);
				return {
					day : parseInt(date[1], 10),
					month : parseInt(date[0], 10),
					year : parseInt(date[2], 10)
				};
				break;
			case 'yyyy-mm-dd':
				delimitter = '-';
				date = value.split(delimitter);
				return {
					day : parseInt(date[2], 10),
					month : parseInt(date[1], 10),
					year : parseInt(date[0], 10)
				};
				break;
			case 'dd/mm/yyyy':
				delimitter = '/';
				date = value.split(delimitter);
				return {
					day : parseInt(date[0], 10),
					month : parseInt(date[1], 10),
					year : parseInt(date[2], 10)
				};
				break;
			case 'dd-MM-yyyy':
				delimitter = '-';
				date = value.split(delimitter);
				return {
					day : parseInt(date[0], 10),
					month : parseInt(date[1], 10),
					year : parseInt(date[2], 10)
				};
				break;
			default:
				delimitter = '-';
				date = value.split(delimitter);
				return {
					day : parseInt(date[2], 10),
					month : parseInt(date[1], 10),
					year : parseInt(date[0], 10)
				};
				break;
		}
	}
  
	format(date: NgbDateStruct | null): string {
		let delimitter = '-';
		switch (INPUT_FORMAT) {
			case 'mm-dd-yyyy':
				delimitter = '-';
				return date ? date.month + delimitter + date.day + delimitter + date.year : '';
				break;
			case 'yyyy-mm-dd':
				delimitter = '-';
				return date ? date.year + delimitter + date.month + delimitter + date.day : '';
				break;
			case 'dd/mm/yyyy':
				delimitter = '/';
				return date ? date.day + delimitter + date.month + delimitter + date.year : '';
				break;
			case 'dd-MM-yyyy':
				delimitter = '-';
				return date ? date.day + delimitter + date.month + delimitter + date.year : '';
				break;
			default:
				delimitter = '-';
				return date ? date.year + delimitter + date.month + delimitter + date.day : '';
				break;
		}
	}
 }
 
 @Component({
	selector: 'app-sophia-datepicker',
	templateUrl: './sophia-datepicker.component.html',
	styleUrls: ['./sophia-datepicker.component.css'],
	providers: [
		{provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
	  ]
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
	@Input() inputFormat: string | null = null;
	@Input() mobileView: boolean | null = null;

	@Output('timeframe') timeframe: EventEmitter<Array<Date | string> | Date  | string> = new EventEmitter<Array<Date | string> | Date | string>();
	@Output('timeframeISO') timeframeISO: EventEmitter<Array<string> | string> = new EventEmitter<Array<string> | string>();
	@Output('timeframeUTC') timeframeUTC: EventEmitter<Array<string> | string> = new EventEmitter<Array<string> | string>();
	@Output('timeframeDate') timeframeDate: EventEmitter<Array<Date> | Date> = new EventEmitter<Array<Date> | Date>();
	
	
	isMobile: boolean = false;
	ngbStartTime: NgbTimeStruct | null = null
	ngbEndTime: NgbTimeStruct | null = null
	ngbStartDate: NgbDateStruct | string | null = null;
	ngbEndDate: NgbDateStruct | string | null = null;
	timeframeButtonModel: NgModel | number | null = null;
	timeframeSelect: NgModel | number | null = 0;
	readonly minDate = new NgbDate(1999, 1, 1);
		
	constructor(private dateAdapter: NgbDateAdapter<string>) {
	}
	get today(){
		const now = new Date();
		return new NgbDate(now.getFullYear(), now.getMonth()+1, now.getDate());
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
		INPUT_FORMAT = this.inputFormat??INPUT_FORMAT;
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (this.startDate) {
			this.ngbStartDate = this.adapt(this.dateToNgbDate(this.startDate));
			this.ngbStartTime = this.dateToNgbTime(this.startDate);
		}
		if (this.endDate) {
			this.ngbEndDate = this.adapt(this.dateToNgbDate(this.endDate));
			this.ngbEndTime = this.dateToNgbTime(this.endDate);
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
		this.ngbStartDate = this.adapt(new NgbDate(diff_date.getFullYear(), diff_date.getMonth() + 1, diff_date.getDate()));
		this.ngbEndDate = this.adapt(this.today);
		console.log(this.ngbStartDate);
		if (!this.submitButton) {
			this.emitDateSelection();
		}
	}
	emitDateSelection(){
		switch (this.type) {
			case 'single':
				this.ngbStartDate = this.ngbStartDate  as NgbDateStruct ?? this.today  as NgbDateStruct;	
				this.ngbStartTime = this.ngbStartTime??{ hour: 0, minute: 0, second: 0};
				const date = Date.UTC(this.ngbStartDate?.year, this.ngbStartDate?.month - 1, this.ngbStartDate?.day, this.ngbStartTime?.hour, this.ngbStartTime?.minute, this.ngbStartTime?.second, 0);
				this.timeframe.emit(
					this.format(new Date(date), this.dateFormat)
				);				
				this.timeframeISO.emit(new Date(date).toISOString());
				this.timeframeUTC.emit(new Date(date).toUTCString());
				this.timeframeDate.emit(new Date(date));
				break;
				
			case 'multiple':
				this.ngbStartDate = this.ngbStartDate as NgbDateStruct ?? this.today as NgbDateStruct;
				this.ngbStartTime = this.ngbStartTime??{ hour: 0, minute: 0, second: 0};
				this.ngbEndDate = this.ngbEndDate as NgbDateStruct ?? this.today as NgbDateStruct ;
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
				this.timeframeDate.emit([
					startDate,
					endDate
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
			return fnsFormat(to_format_date, dateformat);
		}
		return date;
	}
	dateToNgbDate(date: Date): NgbDateStruct {
		return new NgbDate(date.getFullYear(), date.getMonth(), date.getDate());
	}
	dateToNgbTime(date: Date): NgbTimeStruct {
		return { hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() };
	}
	adapt(model: NgbDateStruct | string | null): NgbDateStruct | string | null {
		if (!!model && typeof model !== 'string') {
			return this.dateAdapter.toModel(model);
		}
		return model;
	}
}