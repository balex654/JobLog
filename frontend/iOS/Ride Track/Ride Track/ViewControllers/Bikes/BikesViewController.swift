//
//  BikesViewController.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/28/22.
//

import UIKit

class BikesViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

    @IBOutlet weak var editButton: UIBarButtonItem!
    @IBOutlet weak var bikesLabel: UILabel!
    @IBOutlet weak var tableView: UITableView!
    
    var bikes: [Bike] = []
    var fromStartActivity = false
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if fromStartActivity {
            bikesLabel.text = "Select Bike for Activity"
        }
        
        getBikes()
    }
    
    func getBikes() {
        Task {
            bikes = await HttpService.getBikes()
            tableView.reloadData()
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return bikes.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "bikesTableViewCell", for: indexPath) as! BikesTableViewCell
        let currentBike = bikes[indexPath.row]
        cell.BikeLabel.text = currentBike.name
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let bike = bikes[indexPath.row]
        if fromStartActivity {
            Variables.selectedBike = bike
            NotificationCenter.default.post(name: Notification.Name("startActivity"), object: nil)
            self.dismiss(animated: true)
        }
        else {
            editBike(bike: bike)
        }
    }
    
    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        Task {
            let bike = bikes[indexPath.row]
            bikes.remove(at: indexPath.row)
            self.tableView.deleteRows(at: [indexPath], with: .fade)
            await HttpService.deleteBike(bike: bike)
            self.getBikes()
        }
    }
    
    func editBike(bike: Bike) {
        let alert = UIAlertController(title: "Edit Bike", message: "Name & Weight (kg)", preferredStyle: .alert)
        alert.addTextField{ (UITextField) in
            UITextField.text = bike.name
        }
        alert.addTextField{ (UITextField) in
            UITextField.text = String(bike.weight)
            UITextField.keyboardType = .decimalPad
        }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Save", style: .default, handler: { action in
            let name = alert.textFields![0] as UITextField
            let weight = alert.textFields![1] as UITextField
            if self.isFormValid(name: name.text!, weight: weight.text!) {
                Task {
                    bike.name = name.text!
                    bike.weight = Double(weight.text!)!
                    await HttpService.editBike(bike: bike)
                    self.getBikes()
                }
            }
        }))
        self.present(alert, animated: true)
    }
    
    @IBAction func AddBikeAction(_ sender: Any) {
        let alert = UIAlertController(title: "Add Bike", message: nil, preferredStyle: .alert)
        alert.addTextField{ (UITextField) in
            UITextField.placeholder = "Name"
        }
        alert.addTextField{ (UITextField) in
            UITextField.placeholder = "Weight (kg)"
            UITextField.keyboardType = .decimalPad
        }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Add", style: .default, handler: { [self] action in
            let name = alert.textFields![0] as UITextField
            let weight = alert.textFields![1] as UITextField
            if isFormValid(name: name.text!, weight: weight.text!) {
                Task {
                    await HttpService.createBike(bike: Bike(id: 0, weight: Double(weight.text!)!, name: name.text!, user_id: ""))
                    self.getBikes()
                }
            }
        }))
        self.present(alert, animated: true, completion: nil)
    }
    
    func isFormValid(name: String, weight: String) -> Bool {
        if name == "" || weight == "" {
            Util.MakeAlert(message: "A field is empty", vc: self)
            return false
        }
        if name.count > 200 {
            Util.MakeAlert(message: "Input can't be greater than 200 characters", vc: self)
            return false
        }
        if Double(weight) == nil {
            Util.MakeAlert(message: "Weight must be a number", vc: self)
            return false
        }
        return true
    }
    
    @IBAction func editButton(_ sender: Any) {
        tableView.setEditing(!tableView.isEditing, animated: true)
        editButton.title = tableView.isEditing ? "Done" : "Edit"
    }
}
