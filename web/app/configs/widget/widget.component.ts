import { ScalarService } from "../../shared/scalar.service";
import { Widget, ScalarToWidgets } from "../../shared/models/widget";
import { ToasterService } from "angular2-toaster";

const SCALAR_WIDGET_LINKS = [
    "https://scalar-staging.riot.im/scalar/api/widgets/__TYPE__.html?url=",
    "https://scalar-staging.vector.im/scalar/api/widgets/__TYPE__.html?url=",
    "https://scalar-develop.riot.im/scalar/api/widgets/__TYPE__.html?url=",
    "https://demo.riot.im/scalar/api/widgets/__TYPE__.html?url=",
];

export class WidgetComponent {

    public isLoading = true;
    public isUpdating = false;
    public widgets: Widget[];
    public newWidgetUrl: string = "";
    public newWidgetName: string = "";

    private toggledWidgetIds: string[] = [];
    private wrapperUrl = "";
    private scalarWrapperUrls: string[] = [];

    constructor(protected toaster: ToasterService,
                protected scalarApi: ScalarService,
                protected roomId: string,
                window: Window,
                private primaryWidgetType: string,
                alternateWidgetType: string,
                requestedEditId: string,
                private defaultName: string,
                wrapperId = "generic",
                scalarWrapperId = null) {
        this.isLoading = true;
        this.isUpdating = false;
        this.wrapperUrl = window.location.origin + "/widgets/" + wrapperId + "?url=";

        if (!scalarWrapperId) scalarWrapperId = wrapperId;
        for (let widgetLink of SCALAR_WIDGET_LINKS) {
            this.scalarWrapperUrls.push(widgetLink.replace("__TYPE__", scalarWrapperId));
        }

        this.getWidgetsOfType(primaryWidgetType, alternateWidgetType).then(widgets => {
            this.widgets = widgets;
            this.isLoading = false;
            this.isUpdating = false;

            // Unwrap URLs for easy-editing
            for (let widget of this.widgets) {
                this.setWidgetUrl(widget);
            }

            // See if we should request editing a particular widget
            if (requestedEditId) {
                for (let widget of this.widgets) {
                    if (widget.id === requestedEditId) {
                        console.log("Requesting edit for " + widget.id);
                        this.editWidget(widget);
                    }
                }
            }
        });
    }

    private getWidgetsOfType(type: string, altType: string): Promise<Widget[]> {
        return this.scalarApi.getWidgets(this.roomId)
            .then(resp => ScalarToWidgets(resp))
            .then(widgets => {
                let filtered: Widget[] = [];

                for (let widget of widgets) {
                    if (widget.type === type || (altType && widget.type === altType))
                        filtered.push(widget);
                }

                return filtered;
            });
    }

    private getWrappedUrl(url: string): string {
        const urls = [this.wrapperUrl].concat(this.scalarWrapperUrls);
        for (let scalarUrl of urls) {
            if (url.startsWith(scalarUrl)) {
                return decodeURIComponent(url.substring(scalarUrl.length));
            }
        }
        return url;
    }

    private wrapUrl(url: string): string {
        return this.wrapperUrl + encodeURIComponent(url);
    }

    private setWidgetUrl(widget: Widget) {
        widget.url = this.getWrappedUrl(widget.url);

        // Use the Dimension-specific URL override if one is present
        if (widget.data && widget.data.dimOriginalUrl) {
            widget.url = widget.data.dimOriginalUrl;
        }
    }

    public addWidget(data: any = null) {
        let constructedWidget: Widget = {
            id: "dimension-" + this.primaryWidgetType + "-" + (new Date().getTime()),
            url: this.wrapUrl(this.newWidgetUrl),
            type: this.primaryWidgetType,
            name: this.newWidgetName || this.defaultName,
        };
        if (data) constructedWidget.data = data;

        this.isUpdating = true;
        this.scalarApi.setWidget(this.roomId, constructedWidget)
            .then(() => this.widgets.push(constructedWidget))
            .then(() => this.setWidgetUrl(constructedWidget))
            .then(() => {
                this.isUpdating = false;
                this.newWidgetUrl = "";
                this.newWidgetName = "";
                this.toaster.pop("success", "Widget added!");
            })
            .catch(err => {
                this.toaster.pop("error", err.json().error);
                console.error(err);
                this.isUpdating = false;
            });
    }

    public saveWidget(widget: Widget) {
        if (widget.newUrl.trim().length === 0) {
            this.toaster.pop("warning", "Please enter a URL for the widget");
            return;
        }

        widget.name = widget.newName || this.defaultName;
        widget.url = this.wrapUrl(widget.newUrl);

        this.isUpdating = true;
        this.scalarApi.setWidget(this.roomId, widget)
            .then(() => this.toggleWidget(widget))
            .then(() => {
                this.isUpdating = false;
                this.toaster.pop("success", "Widget updated!");
            })
            .catch(err => {
                this.toaster.pop("error", err.json().error);
                console.error(err);
                this.isUpdating = false;
            });
    }

    public removeWidget(widget: Widget) {
        this.isUpdating = true;
        this.scalarApi.deleteWidget(this.roomId, widget)
            .then(() => this.widgets.splice(this.widgets.indexOf(widget), 1))
            .then(() => {
                this.isUpdating = false;
                this.toaster.pop("success", "Widget deleted!");
            })
            .catch(err => {
                this.toaster.pop("error", err.json().error);
                console.error(err);
                this.isUpdating = false;
            });
    }

    public editWidget(widget: Widget) {
        widget.newName = widget.name || this.defaultName;
        widget.newUrl = widget.url;
        this.toggleWidget(widget);
    }

    public toggleWidget(widget: Widget) {
        let idx = this.toggledWidgetIds.indexOf(widget.id);
        if (idx === -1) this.toggledWidgetIds.push(widget.id);
        else this.toggledWidgetIds.splice(idx, 1);
    }

    public isWidgetToggled(widget: Widget) {
        return this.toggledWidgetIds.indexOf(widget.id) !== -1;
    }
}
