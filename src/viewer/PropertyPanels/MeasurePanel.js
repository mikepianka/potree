

import {Utils} from "../../utils.js";

export class MeasurePanel{

	constructor(viewer, measurement, propertiesPanel){
		this.viewer = viewer;
		this.measurement = measurement;
		this.propertiesPanel = propertiesPanel;

		this._update = () => { this.update(); };
	}

	createCoordinatesTable(points){
		let table = $(`
			<table class="measurement_value_table">
				<tr>
					<th>x</th>
					<th>y</th>
					<th>z</th>
					<th></th>
				</tr>
			</table>
		`);

		let copyIconPath = Potree.resourcePath + '/icons/copy.svg';

		for (let point of points) {
			let x = Utils.addCommas(point.x.toFixed(3));
			let y = Utils.addCommas(point.y.toFixed(3));
			let z = Utils.addCommas(point.z.toFixed(3));

			let row = $(`
				<tr>
					<td><span>${x}</span></td>
					<td><span>${y}</span></td>
					<td><span>${z}</span></td>
					<td align="right" style="width: 25%">
						<img name="copy" title="copy" class="button-icon" src="${copyIconPath}" style="width: 16px; height: 16px"/>
					</td>
				</tr>
			`);

			this.elCopy = row.find("img[name=copy]");
			this.elCopy.click( () => {
				let msg = point.toArray().map(c => c.toFixed(3)).join(", ");
				Utils.clipboardCopy(msg);

				this.viewer.postMessage(
					`Copied value to clipboard: <br>'${msg}'`,
					{duration: 3000});
			});

			table.append(row);
		}

		return table;
	};

	createAttributesTable(){
		let elTable = $('<table class="measurement_value_table"></table>');

		let point = this.measurement.points[0];

		for (let attributeName of Object.keys(point)) {
			if (['position', 'x', 'y', 'z'].includes(attributeName)) {
				// don't show in attributes table
				continue;
			} else if (attributeName === "rgba") {
				let color = point.rgba;
				let text = color.join(', ');

				elTable.append($(`
					<tr>
						<td>rgb</td>
						<td>${text}</td>
					</tr>
				`));
			} else if (attributeName === "userData") {
				for (const [key, value] of Object.entries(point.userData)) {
					if (key === "url") {
						elTable.append($(`
							<tr>
								<td>link</td>
								<td><a href="${value}" target="_blank" rel="noopener noreferrer">Hyperlink</a></td>
							</tr>
						`));
					} else {
						elTable.append($(`
							<tr>
								<td>${key}</td>
								<td>${value}</td>
							</tr>
						`));
					}
				}
			} else{
				try {
					let value = point[attributeName];
					let text = value.join(', ');

					elTable.append($(`
						<tr>
							<td>${attributeName}</td>
							<td>${text}</td>
						</tr>
					`));
				}
				catch (TypeError) {
					// attribute is not an array
					let text = point[attributeName];

					elTable.append($(`
						<tr>
							<td>${attributeName}</td>
							<td>${text}</td>
						</tr>
					`));
				}
			}
		}

		return elTable;
	}

	update(){

	}
};