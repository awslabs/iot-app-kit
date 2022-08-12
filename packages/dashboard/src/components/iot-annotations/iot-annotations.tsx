import { Component, State, Prop, h, Watch } from '@stencil/core';
import { DashboardState, DashboardStore } from '../../types';
import { onUpdateAction } from '../../dashboard-actions/actions';
import { XAnnotation } from '@synchro-charts/core';
import { addXAnnotation, editXAnnotation, deleteXAnnotation } from './annotations';
import { viewportEndDate, viewportStartDate } from '@iot-app-kit/core';

const DEFAULT_LIST_VISIBLE_ANNOTATIONS = false;
const DEFAULT_DATE = new Date(0);

@Component({
  tag: 'iot-annotations',
})
export class IotAnnotations {
  /** Holds all necessary information about dashboard */
  @Prop() state: DashboardState;

  /** App Redux store */
  @Prop() store: DashboardStore;

  @State() onlyListVisibleAnnotations: boolean = DEFAULT_LIST_VISIBLE_ANNOTATIONS;

  @State() addLabel = '';
  @State() addColor = 'red';
  @State() addDate: Date = DEFAULT_DATE;

  @State() deleteAnnotationId = '';

  @State() editLabel = '';
  @State() editColor = 'red';
  @State() editDate: Date = DEFAULT_DATE;
  @State() editAnnotationId = '';

  @State() annotationOptions: XAnnotation[] = [];

  @Watch('state')
  private onPropUpdate() {
    this.updateAnnotationOptions();
  }

  onListVisibleAnnotations = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.onlyListVisibleAnnotations = target.checked;
    this.updateAnnotationOptions();
  };

  /**
   * Modify annotation data based on input from UI
   */
  onSelectWidgetInput = (e: Event) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const widgetId = target.value;
    this.state.selectedWidgetIds[0] = widgetId;
  };

  onAddLabelInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.addLabel = target.value;
  };

  onAddColorInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.addColor = target.value;
  };

  onAddDateInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.addDate = new Date(target.value);
  };

  onDeleteAnnotationIdInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.deleteAnnotationId = target.value;
  };

  onEditLabelInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.editLabel = target.value;
  };

  onEditColorInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.editColor = target.value;
  };

  onEditDateInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.editDate = new Date(target.value);
  };

  onEditAnnotationIdInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.editAnnotationId = target.value;
    const annotation = this.state.dashboardConfiguration.widgets
      .find((widget) => widget.id === this.state.selectedWidgetIds[0])
      ?.annotations?.x?.find((annotation) => annotation.id === this.editAnnotationId);
    (document.getElementById('editLabel') as HTMLTextAreaElement).value = annotation?.label
      ? annotation?.label.text
      : '';
    (document.getElementById('editColor') as HTMLInputElement).value = annotation?.color ? annotation?.color : 'red';
  };

  updateAnnotationOptions = () => {
    this.annotationOptions = this.findAnnotations();
  };

  /** Update state when annotation add/edit/delete is made */
  update = (fieldsToUpdate: Partial<DashboardState>, previousField: Partial<DashboardState>) => {
    this.store.dispatch(onUpdateAction({ fieldsToUpdate, previousField }));
  };

  addAnnotation = (e: Event) => {
    e.preventDefault();
    if (e && this.addDate !== DEFAULT_DATE) {
      const annotationLabel = { text: this.addLabel, show: true };
      const XANNOTATION: XAnnotation = {
        color: this.addColor,
        value: this.addDate,
        id: Date.now().toString(),
        showValue: true,
        label: annotationLabel,
      };
      const newWidgets = addXAnnotation({
        dashboardConfiguration: this.state.dashboardConfiguration,
        widgetId: this.state.selectedWidgetIds[0],
        annotation: XANNOTATION,
      });
      this.update(
        { dashboardConfiguration: { ...this.state.dashboardConfiguration, widgets: newWidgets } },
        { dashboardConfiguration: this.state.dashboardConfiguration }
      );
    }
    this.updateAnnotationOptions();
    (document.getElementById('addLabel') as HTMLTextAreaElement).value = '';
  };

  deleteAnnotation = (e: Event) => {
    if (window.confirm('Delete annotation?')) {
      e.preventDefault();
      const newWidgets = deleteXAnnotation({
        dashboardConfiguration: this.state.dashboardConfiguration,
        widgetId: this.state.selectedWidgetIds[0],
        annotationIdToDelete: this.deleteAnnotationId,
      });
      this.update(
        { dashboardConfiguration: { ...this.state.dashboardConfiguration, widgets: newWidgets } },
        { dashboardConfiguration: this.state.dashboardConfiguration }
      );
    }
    this.updateAnnotationOptions();
  };

  editAnnotation = (e: Event) => {
    if (window.confirm('Edit annotation?')) {
      e.preventDefault();
      if (e && this.addDate !== DEFAULT_DATE) {
        const annotationLabel = { text: this.addLabel, show: true };
        const oldWidget = this.state.dashboardConfiguration.widgets
          .find((x) => x.id === this.state.selectedWidgetIds[0])
          ?.annotations?.x?.find((annotation) => annotation.id === this.editAnnotationId);
        const XANNOTATION: XAnnotation = {
          color: this.editColor,
          value: this.editDate,
          id: this.editAnnotationId,
          showValue: true,
          label: annotationLabel ? annotationLabel : oldWidget?.label,
        };
        const newWidgets = editXAnnotation({
          dashboardConfiguration: this.state.dashboardConfiguration,
          widgetId: this.state.selectedWidgetIds[0],
          newAnnotation: XANNOTATION,
        });
        this.update(
          { dashboardConfiguration: { ...this.state.dashboardConfiguration, widgets: newWidgets } },
          { dashboardConfiguration: this.state.dashboardConfiguration }
        );
      }
      this.updateAnnotationOptions();
      (document.getElementById('editLabel') as HTMLTextAreaElement).value = '';
    }
  };

  isVisible = (annotation: XAnnotation) => {
    const start = viewportStartDate(this.state.dashboardConfiguration.viewport).getTime();
    const end = viewportEndDate(this.state.dashboardConfiguration.viewport).getTime();
    const annotationTime = annotation.value.getTime();
    return annotationTime >= start && annotationTime <= end;
  };

  getOnlyVisibleAnnotations = () => {
    return (
      this.state.dashboardConfiguration.widgets
        .find((x) => x.id === this.state.selectedWidgetIds[0])
        ?.annotations?.x?.filter((annotation) => this.isVisible(annotation)) || []
    );
  };

  getAllAnnotations = () => {
    return (
      this.state.dashboardConfiguration.widgets.find((x) => x.id === this.state.selectedWidgetIds[0])?.annotations?.x ||
      []
    );
  };

  findAnnotations = () => {
    return this.onlyListVisibleAnnotations ? this.getOnlyVisibleAnnotations() : this.getAllAnnotations();
  };

  render() {
    return (
      <div>
        <div>
          <label>Only list visible annotations</label>
          <input type="checkbox" checked={this.onlyListVisibleAnnotations} onChange={this.onListVisibleAnnotations} />
        </div>
        <br />
        <br />
        <div>
          <label htmlFor="addAnnotation"> Add annotation -</label>
          <label htmlFor="addLabel"> Label:</label>
          <input type="text" id="addLabel" onChange={this.onAddLabelInput}></input>
          <input type="color" value="#FF0000" onChange={this.onAddColorInput}></input>
          <br />
          <input type="datetime-local" step="1" onChange={this.onAddDateInput}></input>
          <input type="button" value="Add" id="addAnnotation" onClick={this.addAnnotation}></input>
        </div>
        <br />
        <br />
        <div>
          <label htmlFor="deleteAnnotation"> Delete annotation:</label>
          <select id="deleteAnnotation" onChange={this.onDeleteAnnotationIdInput}>
            <option>- Select -</option>
            {this.annotationOptions.map((annotation) => (
              <option value={annotation.id}>{annotation.value.toString()}</option>
            ))}
          </select>
          <input type="button" value="Delete" onClick={this.deleteAnnotation}></input>
        </div>
        <br />
        <br />
        <div>
          <label htmlFor="editAnnotation"> Edit annotation -</label>
          <label htmlFor="editLabel"> Label:</label>
          <input type="text" id="editLabel" onChange={this.onEditLabelInput}></input>
          <input type="color" value="#FF0000" id="editColor" onChange={this.onEditColorInput}></input>
          <br />
          <select id="editAnnotation" onChange={this.onEditAnnotationIdInput}>
            <option>- Select -</option>
            {this.annotationOptions.map((annotation) => (
              <option value={annotation.id}>{annotation.value.toString()}</option>
            ))}
          </select>
          <input type="datetime-local" step="1" id="editDate" onChange={this.onEditDateInput}></input>
          <input type="button" value="Edit" onClick={this.editAnnotation}></input>
        </div>
      </div>
    );
  }
}
